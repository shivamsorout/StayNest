package com.staynest.backend.modules.tenant.dto;

import com.staynest.backend.modules.electricity.dto.ElectricityReadingResponse;
import com.staynest.backend.modules.rent.dto.RentPaymentResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TenantProfileResponse {
    private TenantResponse tenant;
    private List<RentPaymentResponse> rentHistory;
    private List<ElectricityReadingResponse> electricityHistory;
}
