package com.smartshopV1.dto.client;

import com.smartshopV1.enums.ClientTier;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientResponseDTO {
    private Long id;
    private String nom;
    private String email;
    private ClientTier niveauFidelite;
    private Integer totalOrders;
    private BigDecimal totalSpent;

    // Flattened relationship
    private Long userId;
    private String username;
}
