package com.staynest.backend.modules.tenant.repository;

import com.staynest.backend.modules.tenant.entity.Tenant;
import com.staynest.backend.modules.tenant.entity.TenantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    List<Tenant> findByStatusOrderByCheckInDateDesc(TenantStatus status);
    boolean existsByMobileAndStatus(String mobile, TenantStatus status);
    boolean existsByMobileAndStatusAndIdNot(String mobile, TenantStatus status, Long id);
    boolean existsByAadhaarNoAndIdNot(String aadhaarNo, Long id);
    boolean existsByAadhaarNo(String aadhaarNo);
}
