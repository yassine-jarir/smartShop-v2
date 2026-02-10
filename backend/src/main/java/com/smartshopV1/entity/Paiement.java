package com.smartshopV1.entity;

import com.smartshopV1.enums.PaymentStatus;
import com.smartshopV1.enums.TypePaiement;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Paiement {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer numeroPaiement;
    private BigDecimal montant;

    @Enumerated(EnumType.STRING)
    private TypePaiement typePaiement;

    @Enumerated(EnumType.STRING)
    private PaymentStatus statutPaiement;

    private LocalDateTime datePaiement;
    private LocalDateTime dateEncaissement;

    private String reference;
    private String banque;
    private LocalDate dateEcheance;

    @ManyToOne
    private Commande commande;
}

