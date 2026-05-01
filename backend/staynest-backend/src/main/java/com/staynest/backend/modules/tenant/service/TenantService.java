package com.staynest.backend.modules.tenant.service;

import com.staynest.backend.modules.room.entity.Bed;
import com.staynest.backend.modules.room.entity.BedStatus;
import com.staynest.backend.modules.room.entity.Room;
import com.staynest.backend.modules.room.entity.RoomStatus;
import com.staynest.backend.modules.room.repository.BedRepository;
import com.staynest.backend.modules.room.repository.RoomRepository;
import com.staynest.backend.modules.tenant.dto.TenantRequest;
import com.staynest.backend.modules.tenant.dto.TenantResponse;
import com.staynest.backend.modules.tenant.entity.Tenant;
import com.staynest.backend.modules.tenant.entity.TenantStatus;
import com.staynest.backend.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;
    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;

    @Transactional(readOnly = true)
    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TenantResponse> getActiveTenants() {
        return tenantRepository.findByStatusOrderByCheckInDateDesc(TenantStatus.ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TenantResponse getTenant(Long id) {
        return toResponse(findTenant(id));
    }

    @Transactional
    public TenantResponse createTenant(TenantRequest request) {
        validateUniqueFields(request, null);
        Room room = findRoom(request.getRoomId());
        Bed bed = findBedForRoom(room, request.getBedId());

        if (bed.getStatus() != BedStatus.VACANT) {
            throw new RuntimeException("Selected bed is already occupied");
        }

        Tenant tenant = new Tenant();
        applyRequest(tenant, request, room, bed);
        tenant.setStatus(TenantStatus.ACTIVE);
        bed.setStatus(BedStatus.OCCUPIED);
        refreshRoomOccupancy(room);

        return toResponse(tenantRepository.save(tenant));
    }

    @Transactional
    public TenantResponse updateTenant(Long id, TenantRequest request) {
        Tenant tenant = findTenant(id);
        validateUniqueFields(request, id);

        Room newRoom = findRoom(request.getRoomId());
        Bed newBed = findBedForRoom(newRoom, request.getBedId());
        Bed currentBed = tenant.getBed();
        Room currentRoom = tenant.getRoom();

        boolean bedChanged = currentBed == null || !currentBed.getId().equals(newBed.getId());
        if (bedChanged && newBed.getStatus() != BedStatus.VACANT) {
            throw new RuntimeException("Selected bed is already occupied");
        }

        if (bedChanged && currentBed != null) {
            currentBed.setStatus(BedStatus.VACANT);
            refreshRoomOccupancy(currentRoom);
        }

        applyRequest(tenant, request, newRoom, newBed);
        if (tenant.getStatus() == TenantStatus.ACTIVE) {
            newBed.setStatus(BedStatus.OCCUPIED);
            refreshRoomOccupancy(newRoom);
        }

        return toResponse(tenantRepository.save(tenant));
    }

    @Transactional
    public void deleteTenant(Long id) {
        Tenant tenant = findTenant(id);
        if (tenant.getStatus() == TenantStatus.ACTIVE && tenant.getBed() != null) {
            tenant.getBed().setStatus(BedStatus.VACANT);
            refreshRoomOccupancy(tenant.getRoom());
        }
        tenantRepository.delete(tenant);
    }

    @Transactional
    public TenantResponse checkOutTenant(Long id) {
        Tenant tenant = findTenant(id);
        if (tenant.getStatus() == TenantStatus.CHECKED_OUT) {
            return toResponse(tenant);
        }

        tenant.setStatus(TenantStatus.CHECKED_OUT);
        tenant.setCheckOutDate(LocalDate.now());

        if (tenant.getBed() != null) {
            tenant.getBed().setStatus(BedStatus.VACANT);
        }
        refreshRoomOccupancy(tenant.getRoom());

        return toResponse(tenantRepository.save(tenant));
    }

    private void applyRequest(Tenant tenant, TenantRequest request, Room room, Bed bed) {
        tenant.setFullName(request.getFullName().trim());
        tenant.setFatherName(clean(request.getFatherName()));
        tenant.setMobile(request.getMobile().trim());
        tenant.setEmail(clean(request.getEmail()));
        tenant.setAadhaarNo(clean(request.getAadhaarNo()));
        tenant.setAddress(clean(request.getAddress()));
        tenant.setRoom(room);
        tenant.setBed(bed);
        tenant.setCheckInDate(request.getCheckInDate());
    }

    private void validateUniqueFields(TenantRequest request, Long currentTenantId) {
        String mobile = request.getMobile().trim();
        boolean mobileExists = currentTenantId == null
                ? tenantRepository.existsByMobileAndStatus(mobile, TenantStatus.ACTIVE)
                : tenantRepository.existsByMobileAndStatusAndIdNot(mobile, TenantStatus.ACTIVE, currentTenantId);

        if (mobileExists) {
            throw new RuntimeException("Mobile number already exists for an active tenant");
        }

        String aadhaarNo = clean(request.getAadhaarNo());
        if (aadhaarNo != null) {
            boolean aadhaarExists = currentTenantId == null
                    ? tenantRepository.existsByAadhaarNo(aadhaarNo)
                    : tenantRepository.existsByAadhaarNoAndIdNot(aadhaarNo, currentTenantId);
            if (aadhaarExists) {
                throw new RuntimeException("Aadhaar number already exists");
            }
        }
    }

    private Tenant findTenant(Long id) {
        return tenantRepository.findById(id).orElseThrow(() -> new RuntimeException("Tenant not found"));
    }

    private Room findRoom(Long id) {
        return roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    private Bed findBedForRoom(Room room, Long bedId) {
        return room.getBeds()
                .stream()
                .filter(bed -> bed.getId().equals(bedId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Bed not found in selected room"));
    }

    private void refreshRoomOccupancy(Room room) {
        if (room == null) {
            return;
        }

        int occupiedCount = (int) room.getBeds()
                .stream()
                .filter(bed -> bed.getStatus() == BedStatus.OCCUPIED)
                .count();
        room.setOccupiedCount(occupiedCount);

        if (room.getStatus() != RoomStatus.INACTIVE) {
            room.setStatus(occupiedCount >= room.getCapacity() ? RoomStatus.FULL : RoomStatus.AVAILABLE);
        }
    }

    private TenantResponse toResponse(Tenant tenant) {
        Room room = tenant.getRoom();
        Bed bed = tenant.getBed();
        return new TenantResponse(
                tenant.getId(),
                tenant.getFullName(),
                tenant.getFatherName(),
                tenant.getMobile(),
                tenant.getEmail(),
                tenant.getAadhaarNo(),
                tenant.getAddress(),
                room != null ? room.getId() : null,
                room != null ? room.getRoomNo() : null,
                bed != null ? bed.getId() : null,
                bed != null ? bed.getBedNo() : null,
                room != null ? room.getRentAmount() : null,
                tenant.getCheckInDate(),
                tenant.getCheckOutDate(),
                tenant.getStatus()
        );
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
