package com.smartshopV1.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "code_promos")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CodePromo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private BigDecimal pourcentage;

    @OneToMany(mappedBy = "codePromo")
    private List<Commande> commandes;
}
