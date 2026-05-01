package com.staynest.backend.modules.rent.dto;

import com.staynest.backend.modules.rent.entity.PaymentMode;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MarkPaymentRequest {

    private LocalDate paidDate;

    @NotNull(message = "Payment mode is required")
    private PaymentMode paymentMode;

    private BigDecimal lateFee;

    private String remarks;
}
