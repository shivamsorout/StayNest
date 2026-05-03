package com.staynest.backend.modules.pg.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PgPropertyResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String contactNumber;
}
