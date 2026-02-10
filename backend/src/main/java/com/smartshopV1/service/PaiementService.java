package com.smartshopV1.service;

import com.smartshopV1.dto.paiement.PaiementRequestDTO;
import com.smartshopV1.dto.paiement.PaiementResponseDTO;
import com.smartshopV1.enums.PaymentStatus;
import java.util.List;

public interface PaiementService {

    PaiementResponseDTO createPaiement(PaiementRequestDTO dto);
    PaiementResponseDTO encaisserPaiement(Long id);

//    PaiementResponseDTO getPaiementById(Long id);
//
//    List<PaiementResponseDTO> getPaiementsByCommandeId(Long commandeId);
//
//    PaiementResponseDTO updatePaiementStatus(Long id, PaymentStatus status);
//
//    void deletePaiement(Long id);
}
