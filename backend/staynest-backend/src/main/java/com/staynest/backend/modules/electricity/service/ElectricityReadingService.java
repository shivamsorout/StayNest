package com.staynest.backend.modules.electricity.service;

import com.staynest.backend.modules.electricity.dto.ElectricityReadingRequest;
import com.staynest.backend.modules.electricity.dto.ElectricityReadingResponse;
import com.staynest.backend.modules.electricity.entity.ElectricityReading;
import com.staynest.backend.modules.electricity.repository.ElectricityReadingRepository;
import com.staynest.backend.modules.room.entity.Room;
import com.staynest.backend.modules.room.repository.RoomRepository;
import com.staynest.backend.modules.tenant.entity.Tenant;
import com.staynest.backend.modules.tenant.entity.TenantStatus;
import com.staynest.backend.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ElectricityReadingService {

    private static final BigDecimal DEFAULT_UNIT_RATE = BigDecimal.valueOf(8);

    private final ElectricityReadingRepository electricityReadingRepository;
    private final RoomRepository roomRepository;
    private final TenantRepository tenantRepository;

    @Transactional(readOnly = true)
    public List<ElectricityReadingResponse> getAllReadings() {
        return electricityReadingRepository.findAllByOrderByYearDescMonthDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ElectricityReadingResponse> getTenantReadings(Long tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        if (tenant.getRoom() == null) {
            return List.of();
        }

        return electricityReadingRepository.findByRoomIdOrderByYearDescMonthDesc(tenant.getRoom().getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ElectricityReadingResponse saveReading(ElectricityReadingRequest request) {
        if (request.getCurrentUnits().compareTo(request.getPreviousUnits()) < 0) {
            throw new RuntimeException("Current units cannot be less than previous units");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        ElectricityReading reading = electricityReadingRepository
                .findByRoomIdAndMonthAndYear(room.getId(), request.getMonth(), request.getYear())
                .orElseGet(ElectricityReading::new);

        reading.setRoom(room);
        reading.setMonth(request.getMonth());
        reading.setYear(request.getYear());
        reading.setPreviousUnits(request.getPreviousUnits());
        reading.setCurrentUnits(request.getCurrentUnits());
        reading.setUnitRate(request.getUnitRate() != null ? request.getUnitRate() : DEFAULT_UNIT_RATE);

        return toResponse(electricityReadingRepository.save(reading));
    }

    private ElectricityReadingResponse toResponse(ElectricityReading reading) {
        BigDecimal consumedUnits = reading.getCurrentUnits().subtract(reading.getPreviousUnits());
        BigDecimal totalAmount = consumedUnits.multiply(reading.getUnitRate()).setScale(2, RoundingMode.HALF_UP);
        int tenantCount = Math.max(1, tenantRepository.findByRoomIdAndStatus(
                reading.getRoom().getId(), TenantStatus.ACTIVE).size());
        BigDecimal tenantShare = totalAmount.divide(BigDecimal.valueOf(tenantCount), 2, RoundingMode.HALF_UP);

        return new ElectricityReadingResponse(
                reading.getId(),
                reading.getRoom().getId(),
                reading.getRoom().getRoomNo(),
                reading.getMonth(),
                reading.getYear(),
                reading.getPreviousUnits(),
                reading.getCurrentUnits(),
                consumedUnits,
                reading.getUnitRate(),
                totalAmount,
                tenantCount,
                tenantShare
        );
    }
}
