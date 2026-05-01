package com.staynest.backend.modules.rent.repository;

import com.staynest.backend.modules.rent.entity.PaymentStatus;
import com.staynest.backend.modules.rent.entity.RentPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface RentPaymentRepository extends JpaRepository<RentPayment, Long> {
    boolean existsByTenantIdAndMonthAndYear(Long tenantId, Integer month, Integer year);
    List<RentPayment> findByTenantIdOrderByYearDescMonthDesc(Long tenantId);
    List<RentPayment> findByStatusInOrderByDueDateAsc(Collection<PaymentStatus> statuses);
    List<RentPayment> findAllByOrderByYearDescMonthDescDueDateAsc();
}
