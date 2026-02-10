package com.smartshopV1.mapper;

import com.smartshopV1.dto.orderitem.OrderItemRequestDTO;
import com.smartshopV1.dto.orderitem.OrderItemResponseDTO;
import com.smartshopV1.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productNom", source = "product.nom")
    OrderItemResponseDTO toResponseDTO(OrderItem orderItem);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "commande", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "prixUnitaire", ignore = true)
    @Mapping(target = "totalLigne", ignore = true)
    OrderItem toEntity(OrderItemRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "commande", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "prixUnitaire", ignore = true)
    @Mapping(target = "totalLigne", ignore = true)
    void updateEntity(OrderItemRequestDTO dto, @MappingTarget OrderItem orderItem);
}
