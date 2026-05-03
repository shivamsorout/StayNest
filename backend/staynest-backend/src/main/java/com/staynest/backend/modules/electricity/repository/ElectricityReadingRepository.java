package com.staynest.backend.modules.electricity.repository;

import com.staynest.backend.modules.electricity.entity.ElectricityReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ElectricityReadingRepository extends JpaRepository<ElectricityReading, Long> {
    Optional<ElectricityReading> findByRoomIdAndMonthAndYear(Long roomId, Integer month, Integer year);
    List<ElectricityReading> findByRoomIdOrderByYearDescMonthDesc(Long roomId);
    List<ElectricityReading> findAllByOrderByYearDescMonthDesc();
}
