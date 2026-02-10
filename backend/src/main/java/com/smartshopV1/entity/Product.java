package com.smartshopV1.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private BigDecimal prixUnitaire;
    private int stockDisponible;
    private boolean isDeleted = false;

    @OneToMany(mappedBy = "product")
    private List<OrderItem> orderItems;
}

