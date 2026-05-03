package com.staynest.backend.modules.room.repository;

import com.staynest.backend.modules.room.entity.Room;
import com.staynest.backend.modules.room.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    boolean existsByRoomNoIgnoreCaseAndPgPropertyId(String roomNo, Long pgPropertyId);
    boolean existsByRoomNoIgnoreCaseAndPgPropertyIsNull(String roomNo);
    boolean existsByRoomNoIgnoreCaseAndPgPropertyIdAndIdNot(String roomNo, Long pgPropertyId, Long id);
    boolean existsByRoomNoIgnoreCaseAndPgPropertyIsNullAndIdNot(String roomNo, Long id);
    List<Room> findByStatusIn(List<RoomStatus> statuses);
}
