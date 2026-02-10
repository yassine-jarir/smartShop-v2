package com.smartshopV1.dto.paiement;

import com.smartshopV1.enums.PaymentStatus;
import com.smartshopV1.enums.TypePaiement;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class PaiementResponseDTO {

    private Long id;
    private Integer numeroPaiement;
    private BigDecimal montant;

    private TypePaiement typePaiement;
    private PaymentStatus statutPaiement;

    private LocalDateTime datePaiement;
    private LocalDateTime dateEncaissement;

    // For CHEQUE
    private String numeroCheque;
    private String banqueCheque;
    private LocalDateTime dateEcheance;

    // For VIREMENT
    private String referenceVirement;
    private String banqueVirement;

    private Long commandeId;
}

