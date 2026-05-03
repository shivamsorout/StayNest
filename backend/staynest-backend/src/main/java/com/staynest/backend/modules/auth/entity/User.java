package com.staynest.backend.modules.auth.entity;

import com.staynest.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(unique = true)
    private String email;

    @ElementCollection
    @CollectionTable(name = "user_mobile_numbers", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "mobile_number")
    private List<String> mobileNumbers = new ArrayList<>();

    private String password;

    private String role = "ADMIN";

    private String passwordResetOtp;

    private java.time.LocalDateTime passwordResetOtpExpiresAt;
}
