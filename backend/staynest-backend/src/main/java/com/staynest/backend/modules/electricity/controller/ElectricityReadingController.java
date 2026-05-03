package com.staynest.backend.modules.electricity.controller;

import com.staynest.backend.modules.electricity.dto.ElectricityReadingRequest;
import com.staynest.backend.modules.electricity.dto.ElectricityReadingResponse;
import com.staynest.backend.modules.electricity.service.ElectricityReadingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/electricity")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('OWNER','ADMIN')")
public class ElectricityReadingController {

    private final ElectricityReadingService electricityReadingService;

    @GetMapping
    public ResponseEntity<List<ElectricityReadingResponse>> getAllReadings() {
        return ResponseEntity.ok(electricityReadingService.getAllReadings());
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<ElectricityReadingResponse>> getTenantReadings(@PathVariable Long tenantId) {
        return ResponseEntity.ok(electricityReadingService.getTenantReadings(tenantId));
    }

    @PostMapping
    public ResponseEntity<ElectricityReadingResponse> saveReading(@Valid @RequestBody ElectricityReadingRequest request) {
        return ResponseEntity.ok(electricityReadingService.saveReading(request));
    }
}
