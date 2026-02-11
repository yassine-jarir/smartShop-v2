package com.smartshopV1.service.client;

import com.smartshopV1.dto.commande.CommandeResponseDTO;
import com.smartshopV1.entity.Commande;
import com.smartshopV1.exception.ResourceNotFoundException;
import com.smartshopV1.mapper.CommandeMapper;
import com.smartshopV1.repository.CommandeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientOrderServiceImpl implements ClientOrderService {

    private final CommandeRepository commandeRepository;
    private final CommandeMapper commandeMapper;

    @Override
    public List<CommandeResponseDTO> getClientOrders(Long clientId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        return commandeRepository.findByClientId(clientId, pageable)
                .stream()
                .map(commandeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CommandeResponseDTO getOrderDetails(Long clientId, Long orderId) {
        Commande commande = commandeRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        
        // Verify the order belongs to this client
        if (!commande.getClient().getId().equals(clientId)) {
            throw new RuntimeException("Access denied: This order does not belong to you");
        }
        
        return commandeMapper.toResponseDTO(commande);
    }
}
