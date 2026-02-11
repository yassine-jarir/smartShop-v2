package com.smartshopV1.service.admin;

import com.smartshopV1.dto.client.ClientRequestDTO;
import com.smartshopV1.dto.client.ClientResponseDTO;
import com.smartshopV1.entity.Client;
import com.smartshopV1.entity.User;
import com.smartshopV1.enums.ClientTier;
import com.smartshopV1.enums.Role;
import com.smartshopV1.mapper.ClientMapper;
import com.smartshopV1.repository.ClientRepository;
import com.smartshopV1.repository.UserRepository;
import com.smartshopV1.service.AdminClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import static com.smartshopV1.security.annotation.PasswordUtil.hashPassword;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminClientServiceImpl implements AdminClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final ClientMapper clientMapper;
//    private final PasswordEncoder passwordEncoder;

    @Override
    public ClientResponseDTO createClient(ClientRequestDTO dto) {
        
        // Password is required for client creation
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new RuntimeException("Password is required for client creation");
        }

        User user = User.builder()
                .username(dto.getUsername())
                .password(hashPassword(dto.getPassword()))
                .role(Role.CLIENT)
                .build();

        userRepository.save(user);

        Client client = Client.builder()
                .nom(dto.getNom())
                .email(dto.getEmail())
                .user(user)
                .niveauFidelite(ClientTier.BASIC)
                .totalOrders(0)
                .totalSpent(BigDecimal.ZERO)
                .build();

        clientRepository.save(client);

        return clientMapper.toResponseDTO(client);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponseDTO getClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        // Ensure niveauFidelite is set
        if (client.getNiveauFidelite() == null) {
            client.setNiveauFidelite(ClientTier.BASIC);
            clientRepository.save(client);
        }
        return clientMapper.toResponseDTO(client);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponseDTO> listClients() {
        return clientRepository.findAll().stream()
                .peek(client -> {
                    // Ensure niveauFidelite is set for all clients
                    if (client.getNiveauFidelite() == null) {
                        client.setNiveauFidelite(ClientTier.BASIC);
                    }
                })
                .map(clientMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ClientResponseDTO updateClient(Long id, ClientRequestDTO dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // Update client basic info
        client.setNom(dto.getNom());
        client.setEmail(dto.getEmail());

        // Update linked user
        User user = client.getUser();
        user.setUsername(dto.getUsername());
        
        // Only update password if provided
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(hashPassword(dto.getPassword()));
        }
        
        userRepository.save(user);

        Client updated = clientRepository.save(client);
        return clientMapper.toResponseDTO(updated);
    }

    @Override
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client not found");
        }
        clientRepository.deleteById(id);
    }
}
