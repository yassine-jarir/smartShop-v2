package com.smartshopV1.dto.orderitem;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponseDTO {
    private Long id;
    private Integer quantite;
    private BigDecimal prixUnitaire;
    private BigDecimal totalLigne;

    // Flattened
    private Long productId;
    private String productNom;
}
