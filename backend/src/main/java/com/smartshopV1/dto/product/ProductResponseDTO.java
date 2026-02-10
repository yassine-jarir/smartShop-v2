package com.smartshopV1.dto.product;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    private Long id;
    private String nom;
    private BigDecimal prixUnitaire;
    private Integer stockDisponible;
    private Boolean isDeleted;
}
