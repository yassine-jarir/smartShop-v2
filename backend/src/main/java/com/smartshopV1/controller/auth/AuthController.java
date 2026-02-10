package com.smartshopV1.controller.auth;

import com.smartshopV1.dto.auth.LoginRequestDTO;
import com.smartshopV1.dto.user.UserResponseDTO;
import com.smartshopV1.service.auth.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpSession session
    ) {
        return ResponseEntity.ok(
                authService.login(request.getUsername(), request.getPassword(), session)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.noContent().build();
    }
}
