package com.smartshopV1.dto.commande;

import com.smartshopV1.dto.orderitem.OrderItemRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommandeRequestDTO {

    @NotNull(message = "Client ID is required")
    private Long clientId;

    // Promo code string (format PROMO-XXXX)
    private String promoCode;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequestDTO> items;
}
