package com.shippingdost.shipping.model;

import jakarta.persistence.*;
import lombok.*;

// This is for our Kirana Store details
@Entity
@Data 
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String phone;
    
    @Embedded
    private Location location; // Lat and Lng stored here
    
    @Enumerated(EnumType.STRING)
    private Tier tier; // GOLD, SILVER, or BRONZE

    // Helper to get tier name easily in logic
    public String getTier() {
        return (tier != null) ? tier.name() : "BRONZE";
    }
}