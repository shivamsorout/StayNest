package com.staynest.backend.dto;

import com.staynest.backend.entity.BedStatus;
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
