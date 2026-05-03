package com.staynest.backend.modules.tenant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TenantSelfOnboardingRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 120, message = "Full name must be at most 120 characters")
    private String fullName;

    @Size(max = 120, message = "Father name must be at most 120 characters")
    private String fatherName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobile;

    @Pattern(regexp = "^$|^[0-9]{12}$", message = "Aadhaar number must be 12 digits")
    private String aadhaarNo;

    @Size(max = 600, message = "Address must be at most 600 characters")
    private String address;
}
