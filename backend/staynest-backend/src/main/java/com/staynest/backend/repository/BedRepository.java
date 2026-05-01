package com.staynest.backend.repository;

import com.staynest.backend.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByRoomIdOrderByBedNoAsc(Long roomId);
}
