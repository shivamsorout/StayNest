package com.staynest.backend.modules.tenant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TenantRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 120, message = "Full name must be at most 120 characters")
    private String fullName;

    @Size(max = 120, message = "Father name must be at most 120 characters")
    private String fatherName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobile;

    @Email(message = "Email must be valid")
    private String email;

    @Pattern(regexp = "^$|^[0-9]{12}$", message = "Aadhaar number must be 12 digits")
    private String aadhaarNo;

    @Size(max = 600, message = "Address must be at most 600 characters")
    private String address;

    @NotNull(message = "Room is required")
    private Long roomId;

    @NotNull(message = "Bed is required")
    private Long bedId;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;
}
