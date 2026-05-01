package com.staynest.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {

    @NotBlank(message = "Room number is required")
    private String roomNo;

    @NotNull(message = "Floor is required")
    private Integer floor;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Rent amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rent amount must be greater than 0")
    private BigDecimal rentAmount;
}
