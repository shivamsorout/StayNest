package com.staynest.backend.modules.pg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PgPropertyRequest {

    @NotBlank(message = "PG name is required")
    @Size(max = 120, message = "PG name must be at most 120 characters")
    private String name;

    @Size(max = 600, message = "Address must be at most 600 characters")
    private String address;

    @Size(max = 80, message = "City must be at most 80 characters")
    private String city;

    @Size(max = 20, message = "Contact number must be at most 20 characters")
    private String contactNumber;
}
