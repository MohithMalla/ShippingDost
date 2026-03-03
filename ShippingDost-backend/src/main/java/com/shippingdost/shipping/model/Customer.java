package com.shippingdost.shipping.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Enterprise Model representing a B2B Kirana Store.
 */
@Entity
@Data // This provides getters, setters, and toString automatically
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
    private Location location;
    
    @Enumerated(EnumType.STRING)
    private Tier tier; // Enum: GOLD, SILVER, BRONZE

    /**
     * Required for ShippingService.java null-safe check.
     * Returns the name of the tier as a String.
     */
    public String getTier() {
        return (tier != null) ? tier.name() : null;
    }
}