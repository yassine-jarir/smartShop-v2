package com.smartshopV1.service.client;

import com.smartshopV1.dto.commande.CommandeResponseDTO;
import java.util.List;

public interface ClientOrderService {
    List<CommandeResponseDTO> getClientOrders(Long clientId, int page, int size);
    CommandeResponseDTO getOrderDetails(Long clientId, Long orderId);
}
