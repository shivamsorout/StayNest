package com.staynest.backend.controller;

import com.staynest.backend.dto.BedResponse;
import com.staynest.backend.dto.BedStatusRequest;
import com.staynest.backend.dto.RoomRequest;
import com.staynest.backend.dto.RoomResponse;
import com.staynest.backend.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoom(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoom(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(Map.of("message", "Room deleted successfully"));
    }

    @GetMapping("/available")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @GetMapping("/{id}/beds")
    public ResponseEntity<List<BedResponse>> getRoomBeds(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getBeds(id));
    }

    @PatchMapping("/{roomId}/beds/{bedId}/status")
    public ResponseEntity<RoomResponse> updateBedStatus(
            @PathVariable Long roomId,
            @PathVariable Long bedId,
            @Valid @RequestBody BedStatusRequest request
    ) {
        return ResponseEntity.ok(roomService.updateBedStatus(roomId, bedId, request));
    }
}
