package com.staynest.backend.modules.tenant.dto;

import com.staynest.backend.modules.tenant.entity.TenantStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TenantResponse {
    private Long id;
    private String fullName;
    private String fatherName;
    private String mobile;
    private String email;
    private String aadhaarNo;
    private String address;
    private Long roomId;
    private String roomNo;
    private Long bedId;
    private String bedNo;
    private BigDecimal rentAmount;
    private String idProofFile;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private TenantStatus status;
}
