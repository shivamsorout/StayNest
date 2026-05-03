package com.staynest.backend.modules.tenant.service;

import com.staynest.backend.modules.auth.entity.User;
import com.staynest.backend.modules.auth.repository.UserRepository;
import com.staynest.backend.modules.electricity.service.ElectricityReadingService;
import com.staynest.backend.modules.rent.service.RentPaymentService;
import com.staynest.backend.modules.room.entity.Bed;
import com.staynest.backend.modules.room.entity.Room;
import com.staynest.backend.modules.tenant.dto.TenantProfileResponse;
import com.staynest.backend.modules.tenant.dto.TenantResponse;
import com.staynest.backend.modules.tenant.dto.TenantSelfOnboardingRequest;
import com.staynest.backend.modules.tenant.entity.Tenant;
import com.staynest.backend.modules.tenant.entity.TenantStatus;
import com.staynest.backend.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TenantProfileService {

    private static final Path DOCUMENT_UPLOAD_DIR = Path.of("uploads", "tenant-documents");
    private static final Set<String> ALLOWED_DOCUMENT_EXTENSIONS = Set.of(".pdf", ".png", ".jpg", ".jpeg");

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final RentPaymentService rentPaymentService;
    private final ElectricityReadingService electricityReadingService;

    @Transactional(readOnly = true)
    public TenantProfileResponse getCurrentTenantProfile() {
        User user = getAuthenticatedUser();
        Tenant tenant = findActiveTenantForUser(user)
                .orElseThrow(() -> new RuntimeException("No active tenant profile found for this account"));

        return buildProfileResponse(tenant);
    }

    @Transactional
    public TenantProfileResponse createCurrentTenantProfile(TenantSelfOnboardingRequest request) {
        User user = getAuthenticatedUser();
        if (!"TENANT".equals(user.getRole())) {
            throw new RuntimeException("Only tenant accounts can create a tenant profile");
        }

        if (findActiveTenantForUser(user).isPresent()) {
            throw new RuntimeException("Tenant profile already exists for this account");
        }

        String mobile = request.getMobile().trim();
        if (tenantRepository.existsByMobileAndStatus(mobile, TenantStatus.ACTIVE)) {
            throw new RuntimeException("Mobile number already exists for an active tenant");
        }

        Tenant tenant = new Tenant();
        tenant.setFullName(request.getFullName().trim());
        tenant.setFatherName(clean(request.getFatherName()));
        tenant.setMobile(mobile);
        tenant.setEmail(user.getEmail());
        tenant.setAadhaarNo(clean(request.getAadhaarNo()));
        tenant.setAddress(clean(request.getAddress()));
        tenant.setCheckInDate(LocalDate.now());
        tenant.setStatus(TenantStatus.ACTIVE);

        List<String> mobileNumbers = new ArrayList<>(user.getMobileNumbers() == null ? List.of() : user.getMobileNumbers());
        if (!mobileNumbers.contains(mobile)) {
            mobileNumbers.add(mobile);
            user.setMobileNumbers(mobileNumbers);
            userRepository.save(user);
        }

        return buildProfileResponse(tenantRepository.save(tenant));
    }

    @Transactional
    public TenantProfileResponse uploadAadhaarDocument(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select a document to upload");
        }

        String extension = getExtension(file.getOriginalFilename());
        if (!ALLOWED_DOCUMENT_EXTENSIONS.contains(extension)) {
            throw new RuntimeException("Only PDF, PNG, JPG, and JPEG files are allowed");
        }

        User user = getAuthenticatedUser();
        Tenant tenant = findActiveTenantForUser(user)
                .orElseThrow(() -> new RuntimeException("Create tenant profile before uploading documents"));

        try {
            Files.createDirectories(DOCUMENT_UPLOAD_DIR);
            String fileName = "tenant-" + tenant.getId() + "-aadhaar-" + System.currentTimeMillis() + extension;
            Path targetPath = DOCUMENT_UPLOAD_DIR.resolve(fileName).normalize();
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            tenant.setIdProofFile(targetPath.toString());
            return buildProfileResponse(tenantRepository.save(tenant));
        } catch (IOException exception) {
            throw new RuntimeException("Could not upload document");
        }
    }

    private TenantProfileResponse buildProfileResponse(Tenant tenant) {
        return new TenantProfileResponse(
                toResponse(tenant),
                rentPaymentService.getTenantRentPayments(tenant.getId()),
                electricityReadingService.getTenantReadings(tenant.getId())
        );
    }

    private java.util.Optional<Tenant> findActiveTenantForUser(User user) {
        return tenantRepository.findFirstByEmailIgnoreCaseAndStatus(user.getEmail(), TenantStatus.ACTIVE)
                .or(() -> {
                    List<String> mobileNumbers = user.getMobileNumbers();
                    return mobileNumbers == null || mobileNumbers.isEmpty()
                            ? java.util.Optional.empty()
                            : tenantRepository.findFirstByMobileInAndStatus(mobileNumbers, TenantStatus.ACTIVE);
                });
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
                tenant.getIdProofFile(),
                tenant.getCheckInDate(),
                tenant.getCheckOutDate(),
                tenant.getStatus()
        );
    }

    private String getExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
