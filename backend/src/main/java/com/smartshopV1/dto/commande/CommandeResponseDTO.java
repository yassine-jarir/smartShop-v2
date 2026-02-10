package com.smartshopV1.dto.commande;

import com.smartshopV1.dto.orderitem.OrderItemResponseDTO;
import com.smartshopV1.dto.paiement.PaiementResponseDTO;
import com.smartshopV1.enums.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommandeResponseDTO {
    private Long id;
    private LocalDateTime date;
    private OrderStatus statut;
    private BigDecimal sousTotal;
    private BigDecimal remise;
    private BigDecimal tva;
    private BigDecimal totalGlobal;
    private BigDecimal montantRestant;

    // Flattened
    private Long clientId;
    private String clientNom;
    private String clientEmail;

    private Long codePromoId;
    private String codePromoCode;

    private List<OrderItemResponseDTO> items;
    private List<PaiementResponseDTO> paiements;
}
