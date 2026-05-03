package com.staynest.backend.modules.pg.entity;

import com.staynest.backend.common.BaseEntity;
import com.staynest.backend.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pg_properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PgProperty extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 600)
    private String address;

    private String city;

    @Column(length = 20)
    private String contactNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
}
