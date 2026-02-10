package com.smartshopV1.service.admin;

import com.smartshopV1.dto.user.UserRequestDTO;
import com.smartshopV1.dto.user.UserResponseDTO;
import com.smartshopV1.entity.User;
import com.smartshopV1.exception.DuplicateResourceException;
import com.smartshopV1.exception.ResourceNotFoundException;
import com.smartshopV1.mapper.UserMapper;
import com.smartshopV1.repository.UserRepository;
import com.smartshopV1.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.smartshopV1.security.annotation.PasswordUtil.hashPassword;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
//    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO createUser(UserRequestDTO dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username already exists: " + dto.getUsername());
        }
        User user = userMapper.toEntity(dto);
        user.setPassword(hashPassword(dto.getPassword()));
        User saved = userRepository.save(user);
        return userMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return userMapper.toResponseDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> listUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        if (!user.getUsername().equals(dto.getUsername()) &&
                userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username already exists: " + dto.getUsername());
        }
        userMapper.updateEntity(dto, user);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(hashPassword(dto.getPassword()));
        }
        User updated = userRepository.save(user);
        return userMapper.toResponseDTO(updated);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", id);
        }
        userRepository.deleteById(id);
    }
}

