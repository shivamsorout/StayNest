package com.staynest.backend.modules.pg.controller;

import com.staynest.backend.modules.pg.dto.PgPropertyRequest;
import com.staynest.backend.modules.pg.dto.PgPropertyResponse;
import com.staynest.backend.modules.pg.service.PgPropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pgs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PgPropertyController {

    private final PgPropertyService pgPropertyService;

    @GetMapping
    public ResponseEntity<List<PgPropertyResponse>> getMyPgProperties() {
        return ResponseEntity.ok(pgPropertyService.getMyPgProperties());
    }

    @PostMapping
    public ResponseEntity<PgPropertyResponse> createPgProperty(@Valid @RequestBody PgPropertyRequest request) {
        return ResponseEntity.ok(pgPropertyService.createPgProperty(request));
    }
}
