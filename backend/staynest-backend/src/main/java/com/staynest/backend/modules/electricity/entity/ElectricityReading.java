package com.staynest.backend.modules.electricity.entity;

import com.staynest.backend.common.BaseEntity;
import com.staynest.backend.modules.room.entity.Room;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "electricity_readings",
        uniqueConstraints = @UniqueConstraint(columnNames = {"room_id", "bill_month", "bill_year"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ElectricityReading extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "bill_month", nullable = false)
    private Integer month;

    @Column(name = "bill_year", nullable = false)
    private Integer year;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal previousUnits;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal currentUnits;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitRate;
}
