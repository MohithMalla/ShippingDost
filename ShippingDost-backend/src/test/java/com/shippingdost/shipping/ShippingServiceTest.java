package com.shippingdost.shipping;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import com.shippingdost.shipping.model.*;
import com.shippingdost.shipping.service.ShippingService;

import static org.junit.jupiter.api.Assertions.*;

class ShippingServiceTest {

    private final ShippingService shippingService = new ShippingService();

    @ParameterizedTest(name = "Dist: {0}km, Tier: {1}, Expected: {2} (Speed: {3})")
    @CsvSource({
        "45,  GOLD,   143.0, standard", // Van (45*3 + 1*8)
        "150, SILVER, 312.0, standard", // Truck (150*2 + 1*12)
        "600, GOLD,   608.0, standard", // Air (600*1 + 1*8)
        "45,  GOLD,   144.2, express",  // Van + Speed (143 + 1*1.2)
        "200, SILVER, 412.0, standard"  // Truck (200*2 + 1*12)
    })
    void testShippingCalculations(double distance, Tier tier, double expected, String speed) {
        // Arrange
        Customer customer = new Customer();
        customer.setTier(tier);
        
        Product product = new Product();
        product.setWeight(1.0); // Keep weight constant at 1kg for simplicity

        // Act
        double result = shippingService.calculateFinalCharge(customer, product, distance, speed);

        // Assert
        assertEquals(expected, result, 0.01, "Failed for distance: " + distance);
    }
}