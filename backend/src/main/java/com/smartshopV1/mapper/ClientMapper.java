package com.smartshopV1.mapper;

import com.smartshopV1.dto.client.ClientRequestDTO;
import com.smartshopV1.dto.client.ClientResponseDTO;
import com.smartshopV1.entity.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    ClientResponseDTO toResponseDTO(Client client);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "niveauFidelite", ignore = true)
    @Mapping(target = "totalOrders", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "commandes", ignore = true)
    Client toEntity(ClientRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "niveauFidelite", ignore = true)
    @Mapping(target = "totalOrders", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "commandes", ignore = true)
    void updateEntity(ClientRequestDTO dto, @MappingTarget Client client);
}
