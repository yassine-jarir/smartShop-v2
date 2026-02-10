package com.smartshopV1.mapper;

import com.smartshopV1.dto.paiement.PaiementRequestDTO;
import com.smartshopV1.dto.paiement.PaiementResponseDTO;
import com.smartshopV1.entity.Paiement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PaiementMapper {

    @Mapping(target = "commandeId", source = "commande.id")
    PaiementResponseDTO toResponseDTO(Paiement paiement);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "numeroPaiement", ignore = true)
    @Mapping(target = "datePaiement", ignore = true)
    @Mapping(target = "dateEncaissement", ignore = true)
    @Mapping(target = "commande", ignore = true)
    Paiement toEntity(PaiementRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "numeroPaiement", ignore = true)
    @Mapping(target = "datePaiement", ignore = true)
    @Mapping(target = "dateEncaissement", ignore = true)
    @Mapping(target = "commande", ignore = true)
    void updateEntity(PaiementRequestDTO dto, @MappingTarget Paiement paiement);
}
