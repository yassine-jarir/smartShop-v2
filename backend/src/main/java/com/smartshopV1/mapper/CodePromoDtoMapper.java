package com.smartshopV1.mapper;

import com.smartshopV1.dto.codepromo.CodePromoRequestDTO;
import com.smartshopV1.dto.codepromo.CodePromoResponseDTO;
import com.smartshopV1.entity.CodePromo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CodePromoDtoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "commandes", ignore = true)
    CodePromo toEntity(CodePromoRequestDTO dto);

    CodePromoResponseDTO toResponseDTO(CodePromo codePromo);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "commandes", ignore = true)
    void updateEntity(CodePromoRequestDTO dto, @MappingTarget CodePromo codePromo);
}

