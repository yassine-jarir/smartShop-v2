package com.smartshopV1.service.admin;

import com.smartshopV1.dto.paiement.PaiementRequestDTO;
import com.smartshopV1.dto.paiement.PaiementResponseDTO;
import com.smartshopV1.entity.Commande;
import com.smartshopV1.entity.Paiement;
import com.smartshopV1.enums.OrderStatus;
import com.smartshopV1.enums.PaymentStatus;
import com.smartshopV1.mapper.PaiementMapper;
import com.smartshopV1.repository.CommandeRepository;
import com.smartshopV1.repository.PaiementRepository;
import com.smartshopV1.service.PaiementService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class PaiementServiceImpl implements PaiementService {

        private final PaiementRepository paiementRepository;
        private final CommandeRepository commandeRepository;
        private final PaiementMapper paiementMapper;

        @Override
        public PaiementResponseDTO createPaiement(PaiementRequestDTO dto) {

            Commande commande = commandeRepository.findById(dto.getCommandeId())
                    .orElseThrow(() -> new RuntimeException("Commande not found"));

            if (commande.getStatut() != OrderStatus.PENDING)
                throw new RuntimeException("Only PENDING orders can receive payments");

            if (dto.getStatutPaiement() == PaymentStatus.ENCAISSE &&
                    dto.getMontant().compareTo(commande.getMontantRestant()) > 0) {
                throw new RuntimeException("Payment amount exceeds montant restant");
            }

            switch (dto.getTypePaiement()) {
                case ESPECES -> {
                    if (dto.getMontant().compareTo(BigDecimal.valueOf(20000)) > 0)
                        throw new RuntimeException("Cash payment exceeds legal limit (20,000 DH)");

                    if (dto.getStatutPaiement() != PaymentStatus.ENCAISSE)
                        throw new RuntimeException("Cash payments must be ENCAISSE");

                    if (dto.getReference() == null)
                        throw new RuntimeException("Cash payment requires receipt reference");
                }

                case CHEQUE -> {
                    if (dto.getReference() == null || dto.getBanque() == null || dto.getDateEcheance() == null)
                        throw new RuntimeException("Cheque requires reference + banque + échéance");

                    if (dto.getStatutPaiement() == null)
                        dto.setStatutPaiement(PaymentStatus.EN_ATTENTE);
                }

                case VIREMENT -> {
                    if (dto.getReference() == null || dto.getBanque() == null)
                        throw new RuntimeException("Virement requires reference + banque");

                    if (dto.getStatutPaiement() == null)
                        dto.setStatutPaiement(PaymentStatus.EN_ATTENTE);
                }
            }

            Paiement p = paiementMapper.toEntity(dto);
            p.setCommande(commande);
            p.setDatePaiement(LocalDateTime.now());

            int numero = (commande.getPaiements() == null) ? 1 : commande.getPaiements().size() + 1;
            p.setNumeroPaiement(numero);

            if (dto.getStatutPaiement() == PaymentStatus.ENCAISSE) {
                    p.setDateEncaissement(LocalDateTime.now());

                commande.setMontantRestant(
                        commande.getMontantRestant().subtract(dto.getMontant())
                );
            }

            paiementRepository.save(p);
            commande.getPaiements().add(p);
            commandeRepository.save(commande);

            return paiementMapper.toResponseDTO(p);
        }
    @Override
    @Transactional
    public PaiementResponseDTO encaisserPaiement(Long id) {

        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement not found"));

        Commande commande = paiement.getCommande();

        if (paiement.getStatutPaiement() != PaymentStatus.EN_ATTENTE)
            throw new RuntimeException("Only pending payments can be encashed");

        // Update payment status
        paiement.setStatutPaiement(PaymentStatus.ENCAISSE);
        paiement.setDateEncaissement(LocalDateTime.now());

       commande.setMontantRestant(commande.getMontantRestant().subtract(paiement.getMontant()));

        paiementRepository.save(paiement);
        commandeRepository.save(commande);

        return paiementMapper.toResponseDTO(paiement);
    }

}