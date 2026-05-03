package com.staynest.backend.modules.tenant.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TenantAssignmentRequest {

    @NotNull(message = "Room is required")
    private Long roomId;

    @NotNull(message = "Bed is required")
    private Long bedId;
}
