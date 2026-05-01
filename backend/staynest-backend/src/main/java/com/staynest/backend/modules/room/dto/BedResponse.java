package com.staynest.backend.modules.room.dto;

import com.staynest.backend.modules.room.entity.BedStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BedResponse {
    private Long id;
    private String bedNo;
    private BedStatus status;
}
