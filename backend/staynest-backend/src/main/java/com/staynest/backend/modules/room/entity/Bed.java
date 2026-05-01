package com.staynest.backend.modules.room.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.staynest.backend.common.BaseEntity;
import com.staynest.backend.modules.tenant.entity.Tenant;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "beds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bed extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnore
    private Room room;

    @Column(nullable = false)
    private String bedNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BedStatus status = BedStatus.VACANT;

    @OneToOne(mappedBy = "bed", fetch = FetchType.LAZY)
    @JsonIgnore
    private Tenant tenant;
}
