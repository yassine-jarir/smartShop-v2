package com.smartshopV1.controller.client;

import com.smartshopV1.dto.commande.CommandeResponseDTO;
import com.smartshopV1.security.annotation.RequireClient;
import com.smartshopV1.service.client.ClientOrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Client orders controller - allows clients to view their own orders
 */
@RestController
@RequestMapping("/client/orders")
@RequiredArgsConstructor
public class ClientOrderController {

    private final ClientOrderService clientOrderService;

    /**
     * Get own orders with pagination
     */
    @RequireClient
    @GetMapping
    public ResponseEntity<List<CommandeResponseDTO>> getMyOrders(
            HttpSession session,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long clientId = (Long) session.getAttribute("CLIENT_ID");
        return ResponseEntity.ok(clientOrderService.getClientOrders(clientId, page, size));
    }

    /**
     * Get specific order details (only if it belongs to the client)
     */
    @RequireClient
    @GetMapping("/{id}")
    public ResponseEntity<CommandeResponseDTO> getOrderDetails(
            HttpSession session,
            @PathVariable Long id) {
        Long clientId = (Long) session.getAttribute("CLIENT_ID");
        return ResponseEntity.ok(clientOrderService.getOrderDetails(clientId, id));
    }
}
