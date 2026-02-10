package com.smartshopV1.dto.paiement;

 import com.smartshopV1.enums.PaymentStatus;
 import com.smartshopV1.enums.TypePaiement;
 import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
 import java.time.LocalDate;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class PaiementRequestDTO {

    @NotNull
    private Long commandeId;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal montant;

    @NotNull
    private TypePaiement typePaiement;

    private PaymentStatus statutPaiement;

    private String reference;       // For ESPECES receipt OR VIREMENT reference
    private String banque;          // CHEQUE + VIREMENT
    private LocalDate dateEcheance; // CHEQUE only
}
