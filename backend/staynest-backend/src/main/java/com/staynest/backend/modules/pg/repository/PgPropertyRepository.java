package com.staynest.backend.modules.pg.repository;

import com.staynest.backend.modules.pg.entity.PgProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PgPropertyRepository extends JpaRepository<PgProperty, Long> {
    List<PgProperty> findByOwnerEmailOrderByNameAsc(String ownerEmail);
}
