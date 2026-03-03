package com.shippingdost.shipping.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Location {
    // We use 'lat' and 'lng' to match your DistanceEstimator logic
    private double lat;
    private double lng;
}