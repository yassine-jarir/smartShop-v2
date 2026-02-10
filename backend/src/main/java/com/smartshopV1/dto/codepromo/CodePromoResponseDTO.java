package com.smartshopV1.dto.codepromo;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodePromoResponseDTO {
    private Long id;
    private String code;
    private BigDecimal pourcentage;
}
