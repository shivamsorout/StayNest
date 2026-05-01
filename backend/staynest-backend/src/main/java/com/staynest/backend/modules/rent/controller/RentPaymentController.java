package com.staynest.backend.modules.rent.controller;

import com.staynest.backend.modules.rent.dto.MarkPaymentRequest;
import com.staynest.backend.modules.rent.dto.RentPaymentRequest;
import com.staynest.backend.modules.rent.dto.RentPaymentResponse;
import com.staynest.backend.modules.rent.service.RentPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rent")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RentPaymentController {

    private final RentPaymentService rentPaymentService;

    @GetMapping
    public ResponseEntity<List<RentPaymentResponse>> getAllRentPayments() {
        return ResponseEntity.ok(rentPaymentService.getAllRentPayments());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RentPaymentResponse>> getPendingRentPayments() {
        return ResponseEntity.ok(rentPaymentService.getPendingRentPayments());
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<RentPaymentResponse>> getTenantRentPayments(@PathVariable Long tenantId) {
        return ResponseEntity.ok(rentPaymentService.getTenantRentPayments(tenantId));
    }

    @GetMapping("/history/{tenantId}")
    public ResponseEntity<List<RentPaymentResponse>> getTenantPaymentHistory(@PathVariable Long tenantId) {
        return ResponseEntity.ok(rentPaymentService.getTenantRentPayments(tenantId));
    }

    @PostMapping("/generate-monthly")
    public ResponseEntity<List<RentPaymentResponse>> generateMonthlyRent(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        return ResponseEntity.ok(rentPaymentService.generateMonthlyRent(month, year));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<RentPaymentResponse> markAsPaid(
            @PathVariable Long id,
            @Valid @RequestBody MarkPaymentRequest request
    ) {
        return ResponseEntity.ok(rentPaymentService.markAsPaid(id, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentPaymentResponse> updateRentPayment(
            @PathVariable Long id,
            @Valid @RequestBody RentPaymentRequest request
    ) {
        return ResponseEntity.ok(rentPaymentService.updateRentPayment(id, request));
    }
}
