package com.shippingdost.shipping.service;

import org.springframework.stereotype.Service;
import com.shippingdost.shipping.model.*;

@Service
public class ShippingService {

    public double calculateFinalCharge(Customer customer, Product product, double distance, String speed) {
        // Rates: <100km Van (3rs), 100-500 Truck (2rs), >500 Flight (1rs)
        double transportRate = (distance < 100) ? 3.0 : (distance <= 500) ? 2.0 : 1.0;

        // Gold customers get discount, silver/bronze pay more
        double tierMultiplier = "GOLD".equalsIgnoreCase(customer.getTier()) ? 8.0 : 12.0;

        double weight = product.getWeight();

        // Main formula
        double baseCharge = (distance * transportRate) + (weight * tierMultiplier);

        // Extra charge for express delivery
        if ("express".equalsIgnoreCase(speed)) {
            baseCharge += (weight * 1.2);
        }

        return baseCharge;
    }
}