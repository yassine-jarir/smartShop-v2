package com.smartshopV1.service;

import com.smartshopV1.dto.commande.CommandeRequestDTO;
import com.smartshopV1.dto.commande.CommandeResponseDTO;
import java.util.List;

public interface CommandeService {

    CommandeResponseDTO createCommande(CommandeRequestDTO dto);

    CommandeResponseDTO getCommande(Long id);

    List<CommandeResponseDTO> listCommandes();

    CommandeResponseDTO confirmCommande(Long id);

    CommandeResponseDTO cancelCommande(Long id);

    CommandeResponseDTO rejectCommande(Long id);

}
