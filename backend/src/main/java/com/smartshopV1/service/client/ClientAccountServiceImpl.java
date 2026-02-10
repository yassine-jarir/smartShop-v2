package com.smartshopV1.service.client;

import com.smartshopV1.dto.client.ClientResponseDTO;
import com.smartshopV1.entity.Client;
import com.smartshopV1.exception.ResourceNotFoundException;
import com.smartshopV1.mapper.ClientMapper;
import com.smartshopV1.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientAccountServiceImpl implements ClientAccountService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Override
    public ClientResponseDTO getOwnProfile(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));
        return clientMapper.toResponseDTO(client);
    }
}

