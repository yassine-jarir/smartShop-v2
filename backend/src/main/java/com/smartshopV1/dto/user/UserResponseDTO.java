package com.smartshopV1.dto.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartshopV1.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String username;
    private Role role;

    private Long clientId; // flattened relationship

    @JsonIgnore
    private String password; // Never expose in API responses
}
