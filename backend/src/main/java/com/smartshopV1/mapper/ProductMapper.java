package com.smartshopV1.mapper;

import com.smartshopV1.dto.product.ProductRequestDTO;
import com.smartshopV1.dto.product.ProductResponseDTO;
import com.smartshopV1.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    
    ProductResponseDTO toResponseDTO(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Product toEntity(ProductRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void updateEntity(ProductRequestDTO dto, @MappingTarget Product product);
}
