package com.staynest.backend.modules.rent.service;

import com.staynest.backend.modules.rent.dto.MarkPaymentRequest;
import com.staynest.backend.modules.rent.dto.RentPaymentRequest;
import com.staynest.backend.modules.rent.dto.RentPaymentResponse;
import com.staynest.backend.modules.rent.entity.PaymentStatus;
import com.staynest.backend.modules.rent.entity.RentPayment;
import com.staynest.backend.modules.rent.repository.RentPaymentRepository;
import com.staynest.backend.modules.tenant.entity.Tenant;
import com.staynest.backend.modules.tenant.entity.TenantStatus;
import com.staynest.backend.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentPaymentService {

    private final RentPaymentRepository rentPaymentRepository;
    private final TenantRepository tenantRepository;

    @Transactional(readOnly = true)
    public List<RentPaymentResponse> getAllRentPayments() {
        return rentPaymentRepository.findAllByOrderByYearDescMonthDescDueDateAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RentPaymentResponse> getPendingRentPayments() {
        return rentPaymentRepository.findByStatusInOrderByDueDateAsc(
                        List.of(PaymentStatus.PENDING, PaymentStatus.PARTIAL, PaymentStatus.OVERDUE))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RentPaymentResponse> getTenantRentPayments(Long tenantId) {
        return rentPaymentRepository.findByTenantIdOrderByYearDescMonthDesc(tenantId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<RentPaymentResponse> generateMonthlyRent(Integer month, Integer year) {
        YearMonth rentMonth = resolveRentMonth(month, year);
        LocalDate dueDate = rentMonth.atDay(Math.min(5, rentMonth.lengthOfMonth()));

        List<Tenant> activeTenants = tenantRepository.findByStatusOrderByCheckInDateDesc(TenantStatus.ACTIVE);
        List<RentPayment> createdPayments = activeTenants.stream()
                .filter(tenant -> tenant.getRoom() != null)
                .filter(tenant -> !rentPaymentRepository.existsByTenantIdAndMonthAndYear(
                        tenant.getId(), rentMonth.getMonthValue(), rentMonth.getYear()))
                .map(tenant -> buildMonthlyRent(tenant, rentMonth, dueDate))
                .toList();

        return rentPaymentRepository.saveAll(createdPayments)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RentPaymentResponse markAsPaid(Long id, MarkPaymentRequest request) {
        RentPayment rentPayment = findRentPayment(id);
        rentPayment.setStatus(PaymentStatus.PAID);
        rentPayment.setPaidDate(request.getPaidDate() != null ? request.getPaidDate() : LocalDate.now());
        rentPayment.setPaymentMode(request.getPaymentMode());
        rentPayment.setLateFee(request.getLateFee() != null ? request.getLateFee() : BigDecimal.ZERO);
        rentPayment.setRemarks(clean(request.getRemarks()));
        return toResponse(rentPaymentRepository.save(rentPayment));
    }

    @Transactional
    public RentPaymentResponse updateRentPayment(Long id, RentPaymentRequest request) {
        RentPayment rentPayment = findRentPayment(id);
        rentPayment.setRentAmount(request.getRentAmount());
        rentPayment.setDueDate(request.getDueDate());
        rentPayment.setStatus(request.getStatus());
        rentPayment.setLateFee(request.getLateFee() != null ? request.getLateFee() : BigDecimal.ZERO);
        rentPayment.setRemarks(clean(request.getRemarks()));

        if (request.getStatus() != PaymentStatus.PAID) {
            rentPayment.setPaidDate(null);
            rentPayment.setPaymentMode(null);
        }

        return toResponse(rentPaymentRepository.save(rentPayment));
    }

    private RentPayment buildMonthlyRent(Tenant tenant, YearMonth rentMonth, LocalDate dueDate) {
        RentPayment rentPayment = new RentPayment();
        rentPayment.setTenant(tenant);
        rentPayment.setMonth(rentMonth.getMonthValue());
        rentPayment.setYear(rentMonth.getYear());
        rentPayment.setRentAmount(tenant.getRoom().getRentAmount());
        rentPayment.setDueDate(dueDate);
        rentPayment.setStatus(dueDate.isBefore(LocalDate.now()) ? PaymentStatus.OVERDUE : PaymentStatus.PENDING);
        rentPayment.setLateFee(BigDecimal.ZERO);
        return rentPayment;
    }

    private YearMonth resolveRentMonth(Integer month, Integer year) {
        YearMonth currentMonth = YearMonth.now();
        int resolvedMonth = month != null ? month : currentMonth.getMonthValue();
        int resolvedYear = year != null ? year : currentMonth.getYear();

        if (resolvedMonth < 1 || resolvedMonth > 12) {
            throw new RuntimeException("Month must be between 1 and 12");
        }

        return YearMonth.of(resolvedYear, resolvedMonth);
    }

    private RentPayment findRentPayment(Long id) {
        return rentPaymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Rent payment not found"));
    }

    private RentPaymentResponse toResponse(RentPayment rentPayment) {
        refreshOverdueStatus(rentPayment);
        Tenant tenant = rentPayment.getTenant();
        return new RentPaymentResponse(
                rentPayment.getId(),
                tenant.getId(),
                tenant.getFullName(),
                tenant.getMobile(),
                tenant.getRoom() != null ? tenant.getRoom().getRoomNo() : null,
                tenant.getBed() != null ? tenant.getBed().getBedNo() : null,
                rentPayment.getMonth(),
                rentPayment.getYear(),
                rentPayment.getRentAmount(),
                rentPayment.getDueDate(),
                rentPayment.getPaidDate(),
                rentPayment.getPaymentMode(),
                rentPayment.getStatus(),
                rentPayment.getLateFee(),
                rentPayment.getRemarks()
        );
    }

    private void refreshOverdueStatus(RentPayment rentPayment) {
        if (rentPayment.getStatus() == PaymentStatus.PENDING && rentPayment.getDueDate().isBefore(LocalDate.now())) {
            rentPayment.setStatus(PaymentStatus.OVERDUE);
        }
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
