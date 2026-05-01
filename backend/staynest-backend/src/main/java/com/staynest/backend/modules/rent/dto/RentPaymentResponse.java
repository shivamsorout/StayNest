package com.staynest.backend.modules.rent.dto;

import com.staynest.backend.modules.rent.entity.PaymentMode;
import com.staynest.backend.modules.rent.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RentPaymentResponse {
    private Long id;
    private Long tenantId;
    private String tenantName;
    private String mobile;
    private String roomNo;
    private String bedNo;
    private Integer month;
    private Integer year;
    private BigDecimal rentAmount;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private PaymentMode paymentMode;
    private PaymentStatus status;
    private BigDecimal lateFee;
    private String remarks;
}
