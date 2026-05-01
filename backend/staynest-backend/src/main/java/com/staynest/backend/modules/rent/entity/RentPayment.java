package com.staynest.backend.modules.rent.entity;

import com.staynest.backend.common.BaseEntity;
import com.staynest.backend.modules.tenant.entity.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "rent_payments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tenant_id", "rent_month", "rent_year"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RentPayment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(name = "rent_month", nullable = false)
    private Integer month;

    @Column(name = "rent_year", nullable = false)
    private Integer year;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rentAmount;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate paidDate;

    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal lateFee = BigDecimal.ZERO;

    @Column(length = 600)
    private String remarks;
}
