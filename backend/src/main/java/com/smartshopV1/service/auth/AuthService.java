package com.smartshopV1.service.auth;

import com.smartshopV1.dto.user.UserResponseDTO;
import com.smartshopV1.entity.User;
import com.smartshopV1.exception.UnauthorizedException;
import com.smartshopV1.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.smartshopV1.security.annotation.PasswordUtil.checkPassword;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public UserResponseDTO login(String username, String rawPassword, HttpSession session) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        // Compare RAW password (brief does NOT require hashing)
        if (!rawPassword.equals(user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        // Save user in HTTP Session
        session.setAttribute("user", user);
        session.setAttribute("USER_ID", user.getId());
        session.setAttribute("ROLE", user.getRole());
        session.setAttribute("CLIENT_ID",
                user.getClient() == null ? null : user.getClient().getId()
        );

        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .clientId(user.getClient() != null ? user.getClient().getId() : null)
                .build();
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }
}
