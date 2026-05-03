package com.staynest.backend.modules.tenant.service;

import com.staynest.backend.modules.auth.entity.User;
import com.staynest.backend.modules.auth.repository.UserRepository;
import com.staynest.backend.modules.electricity.service.ElectricityReadingService;
import com.staynest.backend.modules.rent.service.RentPaymentService;
import com.staynest.backend.modules.room.entity.Bed;
import com.staynest.backend.modules.room.entity.Room;
import com.staynest.backend.modules.tenant.dto.TenantProfileResponse;
import com.staynest.backend.modules.tenant.dto.TenantResponse;
import com.staynest.backend.modules.tenant.entity.Tenant;
import com.staynest.backend.modules.tenant.entity.TenantStatus;
import com.staynest.backend.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantProfileService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final RentPaymentService rentPaymentService;
    private final ElectricityReadingService electricityReadingService;

    @Transactional(readOnly = true)
    public TenantProfileResponse getCurrentTenantProfile() {
        User user = getAuthenticatedUser();
        Tenant tenant = tenantRepository.findFirstByEmailIgnoreCaseAndStatus(user.getEmail(), TenantStatus.ACTIVE)
                .or(() -> {
                    List<String> mobileNumbers = user.getMobileNumbers();
                    return mobileNumbers == null || mobileNumbers.isEmpty()
                            ? java.util.Optional.empty()
                            : tenantRepository.findFirstByMobileInAndStatus(mobileNumbers, TenantStatus.ACTIVE);
                })
                .orElseThrow(() -> new RuntimeException("No active tenant profile found for this account"));

        return new TenantProfileResponse(
                toResponse(tenant),
                rentPaymentService.getTenantRentPayments(tenant.getId()),
                electricityReadingService.getTenantReadings(tenant.getId())
        );
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    private TenantResponse toResponse(Tenant tenant) {
        Room room = tenant.getRoom();
        Bed bed = tenant.getBed();
        return new TenantResponse(
                tenant.getId(),
                tenant.getFullName(),
                tenant.getFatherName(),
                tenant.getMobile(),
                tenant.getEmail(),
                tenant.getAadhaarNo(),
                tenant.getAddress(),
                room != null ? room.getId() : null,
                room != null ? room.getRoomNo() : null,
                bed != null ? bed.getId() : null,
                bed != null ? bed.getBedNo() : null,
                room != null ? room.getRentAmount() : null,
                tenant.getCheckInDate(),
                tenant.getCheckOutDate(),
                tenant.getStatus()
        );
    }
}
