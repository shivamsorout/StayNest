package com.staynest.backend.modules.pg.service;

import com.staynest.backend.modules.auth.entity.User;
import com.staynest.backend.modules.auth.repository.UserRepository;
import com.staynest.backend.modules.pg.dto.PgPropertyRequest;
import com.staynest.backend.modules.pg.dto.PgPropertyResponse;
import com.staynest.backend.modules.pg.entity.PgProperty;
import com.staynest.backend.modules.pg.repository.PgPropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PgPropertyService {

    private final PgPropertyRepository pgPropertyRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<PgPropertyResponse> getMyPgProperties() {
        return pgPropertyRepository.findByOwnerEmailOrderByNameAsc(getAuthenticatedUser().getEmail())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PgPropertyResponse createPgProperty(PgPropertyRequest request) {
        User owner = getAuthenticatedUser();
        PgProperty pgProperty = new PgProperty();
        applyRequest(pgProperty, request);
        pgProperty.setOwner(owner);
        return toResponse(pgPropertyRepository.save(pgProperty));
    }

    private void applyRequest(PgProperty pgProperty, PgPropertyRequest request) {
        pgProperty.setName(request.getName().trim());
        pgProperty.setAddress(clean(request.getAddress()));
        pgProperty.setCity(clean(request.getCity()));
        pgProperty.setContactNumber(clean(request.getContactNumber()));
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    private PgPropertyResponse toResponse(PgProperty pgProperty) {
        return new PgPropertyResponse(
                pgProperty.getId(),
                pgProperty.getName(),
                pgProperty.getAddress(),
                pgProperty.getCity(),
                pgProperty.getContactNumber()
        );
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
