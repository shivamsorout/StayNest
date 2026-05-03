package com.staynest.backend.modules.room.service;

import com.staynest.backend.modules.room.dto.BedResponse;
import com.staynest.backend.modules.room.dto.BedStatusRequest;
import com.staynest.backend.modules.room.dto.RoomRequest;
import com.staynest.backend.modules.room.dto.RoomResponse;
import com.staynest.backend.modules.pg.entity.PgProperty;
import com.staynest.backend.modules.pg.repository.PgPropertyRepository;
import com.staynest.backend.modules.room.entity.Bed;
import com.staynest.backend.modules.room.entity.BedStatus;
import com.staynest.backend.modules.room.entity.Room;
import com.staynest.backend.modules.room.entity.RoomStatus;
import com.staynest.backend.modules.room.repository.BedRepository;
import com.staynest.backend.modules.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;
    private final PgPropertyRepository pgPropertyRepository;

    @Transactional(readOnly = true)
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getAvailableRooms() {
        return roomRepository.findByStatusIn(List.of(RoomStatus.AVAILABLE)).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoom(Long id) {
        return toResponse(findRoom(id));
    }

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        String roomNo = request.getRoomNo().trim();
        PgProperty pgProperty = findPgProperty(request.getPgPropertyId());

        if (roomNoExistsInPg(roomNo, pgProperty, null)) {
            throw new RuntimeException("Room number already exists");
        }

        Room room = new Room();
        room.setRoomNo(roomNo);
        room.setFloor(request.getFloor());
        room.setCapacity(request.getCapacity());
        room.setRentAmount(request.getRentAmount());
        room.setPgProperty(pgProperty);
        room.setOccupiedCount(0);
        room.setStatus(RoomStatus.AVAILABLE);

        room.setBeds(buildBeds(room, request.getCapacity()));
        return toResponse(roomRepository.save(room));
    }

    @Transactional
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = findRoom(id);
        String roomNo = request.getRoomNo().trim();
        PgProperty pgProperty = findPgProperty(request.getPgPropertyId());

        if (roomNoExistsInPg(roomNo, pgProperty, id)) {
            throw new RuntimeException("Room number already exists");
        }

        if (request.getCapacity() < room.getOccupiedCount()) {
            throw new RuntimeException("Capacity cannot be less than occupied beds");
        }

        room.setRoomNo(roomNo);
        room.setFloor(request.getFloor());
        room.setRentAmount(request.getRentAmount());
        room.setPgProperty(pgProperty);
        resizeBeds(room, request.getCapacity());
        room.setCapacity(request.getCapacity());
        refreshStatus(room);

        return toResponse(roomRepository.save(room));
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = findRoom(id);
        if (room.getOccupiedCount() > 0) {
            throw new RuntimeException("Cannot delete a room with occupied beds");
        }
        roomRepository.delete(room);
    }

    @Transactional(readOnly = true)
    public List<BedResponse> getBeds(Long roomId) {
        findRoom(roomId);
        return bedRepository.findByRoomIdOrderByBedNoAsc(roomId).stream().map(this::toBedResponse).toList();
    }

    @Transactional
    public RoomResponse updateBedStatus(Long roomId, Long bedId, BedStatusRequest request) {
        Room room = findRoom(roomId);
        Bed bed = room.getBeds()
                .stream()
                .filter(item -> item.getId().equals(bedId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Bed not found in this room"));

        bed.setStatus(request.getStatus());
        room.setOccupiedCount((int) room.getBeds()
                .stream()
                .filter(item -> item.getStatus() == BedStatus.OCCUPIED)
                .count());
        refreshStatus(room);

        return toResponse(roomRepository.save(room));
    }

    private Room findRoom(Long id) {
        return roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    private PgProperty findPgProperty(Long id) {
        if (id == null) {
            return null;
        }
        return pgPropertyRepository.findById(id).orElseThrow(() -> new RuntimeException("PG property not found"));
    }

    private boolean roomNoExistsInPg(String roomNo, PgProperty pgProperty, Long currentRoomId) {
        if (pgProperty == null) {
            return currentRoomId == null
                    ? roomRepository.existsByRoomNoIgnoreCaseAndPgPropertyIsNull(roomNo)
                    : roomRepository.existsByRoomNoIgnoreCaseAndPgPropertyIsNullAndIdNot(roomNo, currentRoomId);
        }

        return currentRoomId == null
                ? roomRepository.existsByRoomNoIgnoreCaseAndPgPropertyId(roomNo, pgProperty.getId())
                : roomRepository.existsByRoomNoIgnoreCaseAndPgPropertyIdAndIdNot(roomNo, pgProperty.getId(), currentRoomId);
    }

    private List<Bed> buildBeds(Room room, int capacity) {
        List<Bed> beds = new ArrayList<>();
        for (int i = 1; i <= capacity; i++) {
            Bed bed = new Bed();
            bed.setRoom(room);
            bed.setBedNo("B" + i);
            bed.setStatus(BedStatus.VACANT);
            beds.add(bed);
        }
        return beds;
    }

    private void resizeBeds(Room room, int newCapacity) {
        List<Bed> beds = room.getBeds();
        int currentSize = beds.size();

        if (newCapacity > currentSize) {
            for (int i = currentSize + 1; i <= newCapacity; i++) {
                Bed bed = new Bed();
                bed.setRoom(room);
                bed.setBedNo("B" + i);
                bed.setStatus(BedStatus.VACANT);
                beds.add(bed);
            }
            return;
        }

        if (newCapacity < currentSize) {
            List<Bed> bedsToRemove = beds.stream()
                    .sorted(Comparator.comparingInt(this::bedNumber).reversed())
                    .limit(currentSize - newCapacity)
                    .toList();

            boolean hasOccupiedBed = bedsToRemove.stream().anyMatch(bed -> bed.getStatus() != BedStatus.VACANT);
            if (hasOccupiedBed) {
                throw new RuntimeException("Cannot reduce capacity because higher beds are occupied");
            }

            beds.removeAll(bedsToRemove);
        }
    }

    private int bedNumber(Bed bed) {
        return Integer.parseInt(bed.getBedNo().replaceAll("\\D", ""));
    }

    private void refreshStatus(Room room) {
        if (room.getStatus() == RoomStatus.INACTIVE) {
            return;
        }
        room.setStatus(room.getOccupiedCount() >= room.getCapacity() ? RoomStatus.FULL : RoomStatus.AVAILABLE);
    }

    private RoomResponse toResponse(Room room) {
        List<BedResponse> beds = room.getBeds().stream().map(this::toBedResponse).toList();
        return new RoomResponse(
                room.getId(),
                room.getRoomNo(),
                room.getFloor(),
                room.getCapacity(),
                room.getOccupiedCount(),
                room.getCapacity() - room.getOccupiedCount(),
                room.getRentAmount(),
                room.getPgProperty() != null ? room.getPgProperty().getId() : null,
                room.getPgProperty() != null ? room.getPgProperty().getName() : null,
                room.getStatus(),
                beds
        );
    }

    private BedResponse toBedResponse(Bed bed) {
        return new BedResponse(bed.getId(), bed.getBedNo(), bed.getStatus());
    }
}
