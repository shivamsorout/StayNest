package com.staynest.backend.modules.room.dto;

import com.staynest.backend.modules.room.entity.RoomStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomNo;
    private Integer floor;
    private Integer capacity;
    private Integer occupiedCount;
    private Integer vacantCount;
    private BigDecimal rentAmount;
    private RoomStatus status;
    private List<BedResponse> beds;
}
