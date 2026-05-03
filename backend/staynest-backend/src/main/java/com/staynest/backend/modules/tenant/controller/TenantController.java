package com.staynest.backend.modules.tenant.controller;

import com.staynest.backend.modules.tenant.dto.TenantRequest;
import com.staynest.backend.modules.tenant.dto.TenantProfileResponse;
import com.staynest.backend.modules.tenant.dto.TenantResponse;
import com.staynest.backend.modules.tenant.service.TenantProfileService;
import com.staynest.backend.modules.tenant.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<TenantResponse>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    @PostMapping
    public ResponseEntity<TenantResponse> createTenant(@Valid @RequestBody TenantRequest request) {
        return ResponseEntity.ok(tenantService.createTenant(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenantResponse> getTenant(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.getTenant(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TenantResponse> updateTenant(@PathVariable Long id, @Valid @RequestBody TenantRequest request) {
        return ResponseEntity.ok(tenantService.updateTenant(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTenant(@PathVariable Long id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok(Map.of("message", "Tenant deleted successfully"));
    }

    @PostMapping("/{id}/check-out")
    public ResponseEntity<TenantResponse> checkOutTenant(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.checkOutTenant(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<TenantResponse>> getActiveTenants() {
        return ResponseEntity.ok(tenantService.getActiveTenants());
    }

    @GetMapping("/me/profile")
    public ResponseEntity<TenantProfileResponse> getCurrentTenantProfile() {
        return ResponseEntity.ok(tenantProfileService.getCurrentTenantProfile());
    }
}
