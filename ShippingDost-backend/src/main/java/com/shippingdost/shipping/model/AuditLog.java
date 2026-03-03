package com.shippingdost.shipping.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// This table saves all our previous calculations
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long customerId;
    private Long sellerId;
    private Long warehouseId;
    private String warehouseName; 
    private double finalCharge;
    private double distance; 
    private String transportMode; // Air, Truck, or Van
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now(); // Automatically set time when saving
    }
}