package com.smartshopV1.controller.client;

import com.smartshopV1.dto.client.ClientResponseDTO;
import com.smartshopV1.security.annotation.RequireClient;
import com.smartshopV1.service.client.ClientAccountService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Client controller for self-service operations.
 * All endpoints require CLIENT role.
 */
@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class ClientProfileController {

    private final ClientAccountService clientAccountService;

    /**
     * Get own profile.
     * Retrieves CLIENT_ID from session.
     */
    @RequireClient
    @GetMapping("/profile")
    public ResponseEntity<ClientResponseDTO> getMyProfile(HttpSession session) {
        Long clientId = (Long) session.getAttribute("CLIENT_ID");
        return ResponseEntity.ok(clientAccountService.getOwnProfile(clientId));
    }
}

