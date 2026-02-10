package com.smartshopV1.service.client;

import com.smartshopV1.dto.client.ClientResponseDTO;

public interface ClientAccountService {
    ClientResponseDTO getOwnProfile(Long clientId);
}

