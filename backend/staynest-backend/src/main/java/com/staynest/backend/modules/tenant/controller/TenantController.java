package com.staynest.backend.modules.tenant.controller;

import com.staynest.backend.modules.tenant.dto.TenantAssignmentRequest;
import com.staynest.backend.modules.tenant.dto.TenantRequest;
import com.staynest.backend.modules.tenant.dto.TenantProfileResponse;
import com.staynest.backend.modules.tenant.dto.TenantResponse;
import com.staynest.backend.modules.tenant.dto.TenantSelfOnboardingRequest;
import com.staynest.backend.modules.tenant.service.TenantProfileService;
import com.staynest.backend.modules.tenant.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TenantController {

    private final TenantService tenantService;
    private final TenantProfileService tenantProfileService;

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<List<TenantResponse>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<TenantResponse> createTenant(@Valid @RequestBody TenantRequest request) {
        return ResponseEntity.ok(tenantService.createTenant(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<TenantResponse> getTenant(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.getTenant(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<TenantResponse> updateTenant(@PathVariable Long id, @Valid @RequestBody TenantRequest request) {
        return ResponseEntity.ok(tenantService.updateTenant(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<Map<String, String>> deleteTenant(@PathVariable Long id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok(Map.of("message", "Tenant deleted successfully"));
    }

    @PostMapping("/{id}/check-out")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<TenantResponse> checkOutTenant(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.checkOutTenant(id));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<List<TenantResponse>> getActiveTenants() {
        return ResponseEntity.ok(tenantService.getActiveTenants());
    }

    @PostMapping("/{id}/assign-bed")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<TenantResponse> assignBed(
            @PathVariable Long id,
            @Valid @RequestBody TenantAssignmentRequest request
    ) {
        return ResponseEntity.ok(tenantService.assignBed(id, request));
    }

    @GetMapping("/me/profile")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<TenantProfileResponse> getCurrentTenantProfile() {
        return ResponseEntity.ok(tenantProfileService.getCurrentTenantProfile());
    }

    @PostMapping("/me/profile")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<TenantProfileResponse> createCurrentTenantProfile(
            @Valid @RequestBody TenantSelfOnboardingRequest request
    ) {
        return ResponseEntity.ok(tenantProfileService.createCurrentTenantProfile(request));
    }

    @PostMapping(value = "/me/documents/aadhaar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<TenantProfileResponse> uploadAadhaarDocument(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(tenantProfileService.uploadAadhaarDocument(file));
    }
}
