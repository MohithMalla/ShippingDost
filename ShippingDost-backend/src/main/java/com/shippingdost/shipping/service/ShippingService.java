package com.shippingdost.shipping.service;

import org.springframework.stereotype.Service;

import com.shippingdost.shipping.model.*;

@Service
public class ShippingService {

    public double calculateFinalCharge(Customer customer, Product product, double distance, String speed) {
        // 1. Determine Base Rate by Transport Mode
        // Distance < 100 = MINI_VAN (Rate 3)
        // Distance 100-500 = TRUCK (Rate 2)
        // Distance > 500 = AEROPLANE (Rate 1)
        double transportRate = (distance < 100) ? 3.0 : (distance <= 500) ? 2.0 : 1.0;

        // 2. FIXED: Null-safe Tier Multiplier
        // Putting the string literal first prevents errors if getTier() is null.
        double tierMultiplier = "GOLD".equalsIgnoreCase(customer.getTier().toString()) ? 8.0 : 12.0;

        // 3. Weight Factor from Product
        double weight = product.getWeight();

        // 4. Final Calculation Logic
        double baseCharge = (distance * transportRate) + (weight * tierMultiplier);

        // 5. Speed Premium (₹1.2 per kg for express)
        if ("express".equalsIgnoreCase(speed)) {
            baseCharge += (weight * 1.2);
        }

        return baseCharge;
    }
}