package com.staynest.backend.modules.tenant.entity;

import com.staynest.backend.common.BaseEntity;
import com.staynest.backend.modules.room.entity.Bed;
import com.staynest.backend.modules.room.entity.Room;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tenant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private String fatherName;

    @Column(nullable = false)
    private String mobile;

    private String email;

    @Column(unique = true)
    private String aadhaarNo;

    @Column(length = 600)
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bed_id", unique = true)
    private Bed bed;

    @Column(nullable = false)
    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TenantStatus status = TenantStatus.ACTIVE;

    private String photo;

    @Lob
    private String idProofFile;
}
