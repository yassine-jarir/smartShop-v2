package com.smartshopV1.service;

import com.smartshopV1.dto.client.ClientRequestDTO;
import com.smartshopV1.dto.client.ClientResponseDTO;
import java.util.List;

public interface AdminClientService {
    ClientResponseDTO createClient(ClientRequestDTO dto);
    ClientResponseDTO getClient(Long id);
    List<ClientResponseDTO> listClients();
    ClientResponseDTO updateClient(Long id, ClientRequestDTO dto);
    void deleteClient(Long id);
}

