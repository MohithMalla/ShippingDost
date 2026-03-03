package com.shippingdost.shipping.model; // Ensure this matches the folder path!

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Location {
    private double latitude;
    private double longitude;
}