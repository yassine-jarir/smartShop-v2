package com.smartshopV1.service.admin;

import com.smartshopV1.dto.commande.CommandeRequestDTO;
import com.smartshopV1.dto.commande.CommandeResponseDTO;
import com.smartshopV1.dto.orderitem.OrderItemRequestDTO;
import com.smartshopV1.entity.*;
import com.smartshopV1.enums.ClientTier;
import com.smartshopV1.enums.OrderStatus;
import com.smartshopV1.mapper.CommandeMapper;
import com.smartshopV1.repository.*;
import com.smartshopV1.service.CommandeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
@Transactional
public class CommandeServiceImpl implements CommandeService {

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;
    private final CodePromoRepository codePromoRepository;
    private final CommandeMapper commandeMapper;

    @Override
    public CommandeResponseDTO createCommande(CommandeRequestDTO dto) {

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Commande commande = new Commande();
        commande.setClient(client);
        commande.setDate(LocalDateTime.now());
        commande.setStatut(OrderStatus.PENDING);
        commande.setItems(new ArrayList<>());

        commande.setSousTotal(BigDecimal.ZERO);
        commande.setRemise(BigDecimal.ZERO);
        commande.setTva(BigDecimal.ZERO);
        commande.setTotalGlobal(BigDecimal.ZERO);
        commande.setMontantRestant(BigDecimal.ZERO);

        CodePromo promo = null;
        if (dto.getPromoCode() != null && !dto.getPromoCode().isBlank()) {
            promo = codePromoRepository.findByCode(dto.getPromoCode())
                    .orElseThrow(() -> new RuntimeException("Invalid promo code"));
            commande.setCodePromo(promo);
        }

        BigDecimal sousTotal = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemDto : dto.getItems()) {

            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStockDisponible() < itemDto.getQuantite()) {
                commande.setStatut(OrderStatus.REJECTED);
                commandeRepository.save(commande);
                throw new RuntimeException("Not enough stock for: " + product.getNom());
            }

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantite(itemDto.getQuantite());
            item.setPrixUnitaire(product.getPrixUnitaire());

            BigDecimal lineTotal = product.getPrixUnitaire()
                    .multiply(BigDecimal.valueOf(itemDto.getQuantite()));

            item.setTotalLigne(lineTotal);

            sousTotal = sousTotal.add(lineTotal);

            item.setCommande(commande);
            commande.getItems().add(item);
        }

        commande.setSousTotal(sousTotal);

        BigDecimal fidelityDiscount = BigDecimal.ZERO;

        switch (client.getNiveauFidelite()) {
            case SILVER:
                if (sousTotal.compareTo(BigDecimal.valueOf(500)) >= 0)
                    fidelityDiscount = sousTotal.multiply(BigDecimal.valueOf(0.05));
                break;

            case GOLD:
                if (sousTotal.compareTo(BigDecimal.valueOf(800)) >= 0)
                    fidelityDiscount = sousTotal.multiply(BigDecimal.valueOf(0.10));
                break;

            case PLATINUM:
                if (sousTotal.compareTo(BigDecimal.valueOf(1200)) >= 0)
                    fidelityDiscount = sousTotal.multiply(BigDecimal.valueOf(0.15));
                break;
        }

        BigDecimal promoDiscount = BigDecimal.ZERO;
        if (promo != null) {
            promoDiscount = sousTotal.multiply(
                    promo.getPourcentage().divide(BigDecimal.valueOf(100))
            );
        }

        BigDecimal totalDiscount = fidelityDiscount.add(promoDiscount);

        // Totals
        BigDecimal htAfterDiscount = sousTotal.subtract(totalDiscount);
        BigDecimal tva = htAfterDiscount.multiply(BigDecimal.valueOf(0.20));
        BigDecimal totalGlobal = htAfterDiscount.add(tva);

        commande.setRemise(totalDiscount);
        commande.setTva(tva);
        commande.setTotalGlobal(totalGlobal);
        commande.setMontantRestant(totalGlobal);

        Commande saved = commandeRepository.save(commande);
        return commandeMapper.toResponseDTO(saved);
    }


    @Override
    public CommandeResponseDTO getCommande(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found"));
        return commandeMapper.toResponseDTO(commande);
    }

    @Override
    public java.util.List<CommandeResponseDTO> listCommandes() {
        return commandeRepository.findAll()
                .stream()
                .map(commandeMapper::toResponseDTO)
                .collect(toList());
    }


    @Override
    @Transactional
    public CommandeResponseDTO confirmCommande(Long id) {

        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found"));

        if (commande.getStatut() != OrderStatus.PENDING)
            throw new RuntimeException("Only PENDING orders can be confirmed");

        if (commande.getMontantRestant().compareTo(BigDecimal.ZERO) > 0)
            throw new RuntimeException("Commande is not fully paid");

        // decrement stock
        for (OrderItem item : commande.getItems()) {
            Product p = item.getProduct();
            p.setStockDisponible(p.getStockDisponible() - item.getQuantite());
        }

        // Update client stats
        Client client = commande.getClient();

        client.setTotalOrders(client.getTotalOrders() + 1);
        client.setTotalSpent(client.getTotalSpent().add(commande.getTotalGlobal()));

        // Loyalty
        client.setNiveauFidelite(recalculateTier(client));

        // First last order dates
        if (client.getFirstOrderDate() == null)
            client.setFirstOrderDate(commande.getDate());

        client.setLastOrderDate(commande.getDate());

        // Status update
        commande.setStatut(OrderStatus.CONFIRMED);

        clientRepository.save(client);
        commandeRepository.save(commande);

        return commandeMapper.toResponseDTO(commande);
    }

    @Override
    public CommandeResponseDTO rejectCommande(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found"));

        if (commande.getStatut() == OrderStatus.PENDING) {
            commande.setStatut(OrderStatus.REJECTED);

            Commande saved = commandeRepository.save(commande);
            return commandeMapper.toResponseDTO(saved);
        }

        throw new RuntimeException("Cannot reject commande with status: " + commande.getStatut());
    }


    @Override
    public CommandeResponseDTO cancelCommande(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found"));

        if (commande.getStatut() == OrderStatus.PENDING) {
            commande.setStatut(OrderStatus.CANCELLED);
            Commande saved = commandeRepository.save(commande);
            return commandeMapper.toResponseDTO(saved);
        }

        throw new RuntimeException("Cannot cancel commande with status: " + commande.getStatut());
    }

    private ClientTier recalculateTier(Client client) {

        int totalOrders = client.getTotalOrders();
        BigDecimal spent = client.getTotalSpent();

        if (totalOrders >= 20 || spent.compareTo(BigDecimal.valueOf(15000)) >= 0)
            return ClientTier.PLATINUM;

        if (totalOrders >= 10 || spent.compareTo(BigDecimal.valueOf(5000)) >= 0)
            return ClientTier.GOLD;

        if (totalOrders >= 3 || spent.compareTo(BigDecimal.valueOf(1000)) >= 0)
            return ClientTier.SILVER;

        return ClientTier.BASIC;
    }

}
