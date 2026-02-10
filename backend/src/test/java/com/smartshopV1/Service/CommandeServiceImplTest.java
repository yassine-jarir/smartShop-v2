package com.smartshopV1.Service;

import com.smartshopV1.dto.commande.CommandeRequestDTO;
import com.smartshopV1.dto.orderitem.OrderItemRequestDTO;
import com.smartshopV1.entity.Client;
import com.smartshopV1.entity.Commande;
import com.smartshopV1.entity.Product;
import com.smartshopV1.repository.ClientRepository;
import com.smartshopV1.repository.CodePromoRepository;
import com.smartshopV1.repository.CommandeRepository;
import com.smartshopV1.repository.ProductRepository;
import com.smartshopV1.service.admin.CommandeServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommandeServiceImplTest {

    @Mock
    private CommandeRepository commandeRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private CodePromoRepository codePromoRepository;
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CommandeServiceImpl service;

    @Test
    void createCommande_shouldThrowException_whenStockInsufficient() {
        Client client = new Client();
        client.setId(1L);

        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));

        Product product = new Product();
        product.setId(10L);
        product.setNom("Laptop Dell");
        product.setPrixUnitaire(new BigDecimal("5000"));
        product.setStockDisponible(1);

        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        CommandeRequestDTO dto = new CommandeRequestDTO();
        dto.setClientId(1L);

        OrderItemRequestDTO item = new OrderItemRequestDTO();
        item.setProductId(10L);
        item.setQuantite(5);

        dto.setItems(List.of(item));

        RuntimeException ex = assertThrows(RuntimeException.class , () -> service.createCommande(dto));
        assertTrue(ex.getMessage().contains("Not enough stock"));

        verify(commandeRepository, times(1)).save(any(Commande.class));
    }
    @Test
    void createCommande_shouldThrowException_whenPromoCodeNotInvalid() {
        Client client = new Client();
        client.setId(1L);

        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));


        when(codePromoRepository.findByCode("PROMO-1234")).thenReturn(Optional.empty());

        CommandeRequestDTO dto = new CommandeRequestDTO();
        dto.setClientId(1L);
        dto.setPromoCode("PROMO-1234");

        OrderItemRequestDTO item = new OrderItemRequestDTO();
        item.setProductId(10L);
        item.setQuantite(5);

        dto.setItems(List.of(item));

    RuntimeException ex = assertThrows(RuntimeException.class, () -> service.createCommande(dto));
    assertTrue(ex.getMessage().contains("Invalid promo code"));


    }
}
