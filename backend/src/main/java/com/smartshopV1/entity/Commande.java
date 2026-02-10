package com.smartshopV1.entity;

import com.smartshopV1.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "commandes")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;

    private BigDecimal sousTotal;
    private BigDecimal remise;
    private BigDecimal tva;
    private BigDecimal totalGlobal;
    private BigDecimal montantRestant;

    @Enumerated(EnumType.STRING)
    private OrderStatus statut;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "codepromo_id")
    private CodePromo codePromo;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<Paiement> paiements;
}
