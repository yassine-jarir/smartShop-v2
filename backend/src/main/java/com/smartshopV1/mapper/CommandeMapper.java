package com.smartshopV1.mapper;

import com.smartshopV1.dto.commande.CommandeRequestDTO;
import com.smartshopV1.dto.commande.CommandeResponseDTO;
import com.smartshopV1.entity.Commande;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface CommandeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "date", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "sousTotal", ignore = true)
    @Mapping(target = "remise", ignore = true)
    @Mapping(target = "tva", ignore = true)
    @Mapping(target = "totalGlobal", ignore = true)
    @Mapping(target = "montantRestant", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "codePromo", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "paiements", ignore = true)
    Commande toEntity(CommandeRequestDTO dto);

    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "clientNom", source = "client.nom")
    @Mapping(target = "clientEmail", source = "client.email")
    @Mapping(target = "codePromoId", source = "codePromo.id")
    @Mapping(target = "codePromoCode", source = "codePromo.code")
    CommandeResponseDTO toResponseDTO(Commande commande);
}
