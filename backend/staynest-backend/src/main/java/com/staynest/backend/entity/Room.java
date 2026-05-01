package com.staynest.backend.entity;

import com.staynest.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomNo;

    @Column(nullable = false)
    private Integer floor;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer occupiedCount = 0;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rentAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("bedNo ASC")
    private List<Bed> beds = new ArrayList<>();
}
