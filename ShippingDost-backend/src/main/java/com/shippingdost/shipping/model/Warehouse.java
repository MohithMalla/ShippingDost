package com.shippingdost.shipping.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;

    @Embedded
    private Location location;
}