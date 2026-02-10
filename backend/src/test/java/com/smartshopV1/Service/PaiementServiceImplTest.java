package com.smartshopV1.Service;


import com.smartshopV1.dto.paiement.PaiementRequestDTO;
import com.smartshopV1.entity.Commande;
import com.smartshopV1.enums.OrderStatus;
import com.smartshopV1.enums.PaymentStatus;
import com.smartshopV1.enums.TypePaiement;
import com.smartshopV1.repository.CommandeRepository;
import com.smartshopV1.service.admin.PaiementServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PaiementServiceImplTest {

    @Mock
    CommandeRepository commandeRepository;

    @InjectMocks
    private PaiementServiceImpl service;

    @Test
    void createPaiement_shouldThrowException_whenCommandeNotPending() {
        Commande commande = new Commande();
        commande.setId(1L);
        commande.setStatut(OrderStatus.REJECTED);

        when(commandeRepository.findById(1L)).thenReturn(Optional.of(commande));

        PaiementRequestDTO dto = new PaiementRequestDTO();
        dto.setCommandeId(1L);
        dto.setMontant(new BigDecimal("500"));
        dto.setTypePaiement(TypePaiement.ESPECES);
        dto.setStatutPaiement(PaymentStatus.ENCAISSE);
        dto.setReference("REF-001");

        RuntimeException ex = assertThrows(RuntimeException.class, ()-> service.createPaiement(dto));

        assertTrue(ex.getMessage().contains("Only PENDING orders can receive payments"));
        verify(commandeRepository, times(1)).findById(1L);

    }
    @Test
    void createPaiement_shouldThrowException_whenCashExceedsLimit() {
        Commande commande = new Commande();
        commande.setId(1L);
        commande.setStatut(OrderStatus.PENDING);
        commande.setMontantRestant(new BigDecimal("30000"));

        when(commandeRepository.findById(1L)).thenReturn(Optional.of(commande));

        PaiementRequestDTO dto = new PaiementRequestDTO();
        dto.setCommandeId(1L);
        dto.setMontant(new BigDecimal("25000"));
        dto.setTypePaiement(TypePaiement.ESPECES);
        dto.setStatutPaiement(PaymentStatus.ENCAISSE);
        dto.setReference("REF-999");

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.createPaiement(dto)
        );

        assertTrue(ex.getMessage().contains("Cash payment exceeds legal limit"));
    }


}
