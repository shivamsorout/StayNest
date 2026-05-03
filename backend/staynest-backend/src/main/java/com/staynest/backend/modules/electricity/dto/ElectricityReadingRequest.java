package com.staynest.backend.modules.electricity.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ElectricityReadingRequest {

    @NotNull(message = "Room is required")
    private Long roomId;

    @NotNull(message = "Month is required")
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    private Integer month;

    @NotNull(message = "Year is required")
    private Integer year;

    @NotNull(message = "Previous units are required")
    @DecimalMin(value = "0.0", message = "Previous units cannot be negative")
    private BigDecimal previousUnits;

    @NotNull(message = "Current units are required")
    @DecimalMin(value = "0.0", message = "Current units cannot be negative")
    private BigDecimal currentUnits;

    @DecimalMin(value = "0.0", inclusive = false, message = "Unit rate must be greater than zero")
    private BigDecimal unitRate;
}
