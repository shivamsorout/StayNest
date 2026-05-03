package com.staynest.backend.modules.tenant.repository;

import com.staynest.backend.modules.tenant.entity.Tenant;
import com.staynest.backend.modules.tenant.entity.TenantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    List<Tenant> findByStatusOrderByCheckInDateDesc(TenantStatus status);
    List<Tenant> findByRoomIdAndStatus(Long roomId, TenantStatus status);
    Optional<Tenant> findFirstByEmailIgnoreCaseAndStatus(String email, TenantStatus status);
    Optional<Tenant> findFirstByMobileInAndStatus(Collection<String> mobileNumbers, TenantStatus status);
    boolean existsByMobileAndStatus(String mobile, TenantStatus status);
    boolean existsByMobileAndStatusAndIdNot(String mobile, TenantStatus status, Long id);
    boolean existsByAadhaarNoAndIdNot(String aadhaarNo, Long id);
    boolean existsByAadhaarNo(String aadhaarNo);
}
