package com.shippingdost.shipping.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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
    private String warehouseName; // Added for stats
    private double finalCharge;
    private double distance;      // Added for route analysis
    private String transportMode; // AEROPLANE, TRUCK, or MINI_VAN
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}