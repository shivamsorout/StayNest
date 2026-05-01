package com.staynest.backend.dto;

import com.staynest.backend.entity.BedStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BedStatusRequest {

    @NotNull(message = "Bed status is required")
    private BedStatus status;
}
