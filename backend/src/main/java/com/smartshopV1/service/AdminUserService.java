package com.smartshopV1.service;

import com.smartshopV1.dto.user.UserRequestDTO;
import com.smartshopV1.dto.user.UserResponseDTO;
import java.util.List;

public interface AdminUserService {
    UserResponseDTO createUser(UserRequestDTO dto);
    UserResponseDTO getUser(Long id);
    List<UserResponseDTO> listUsers();
    UserResponseDTO updateUser(Long id, UserRequestDTO dto);
    void deleteUser(Long id);
}

