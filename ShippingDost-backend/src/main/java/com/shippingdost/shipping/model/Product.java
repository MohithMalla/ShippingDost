package com.shippingdost.shipping.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double weight; // Weight is very important for charge

    @Enumerated(EnumType.STRING)
    private Category category; // Regular, Perishable, etc.
}