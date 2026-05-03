package com.staynest.backend.modules.electricity.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ElectricityReadingResponse {
    private Long id;
    private Long roomId;
    private String roomNo;
    private Integer month;
    private Integer year;
    private BigDecimal previousUnits;
    private BigDecimal currentUnits;
    private BigDecimal consumedUnits;
    private BigDecimal unitRate;
    private BigDecimal totalAmount;
    private Integer tenantCount;
    private BigDecimal tenantShare;
}
