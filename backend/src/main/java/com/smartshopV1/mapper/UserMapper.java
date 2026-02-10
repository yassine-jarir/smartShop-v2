package com.smartshopV1.mapper;

import com.smartshopV1.dto.user.UserRequestDTO;
import com.smartshopV1.dto.user.UserResponseDTO;
import com.smartshopV1.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "clientId", source = "client.id")
    UserResponseDTO toResponseDTO(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    User toEntity(UserRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    void updateEntity(UserRequestDTO dto, @MappingTarget User user);
}
