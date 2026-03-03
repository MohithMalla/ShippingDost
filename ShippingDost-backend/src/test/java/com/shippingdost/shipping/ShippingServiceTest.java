package com.shippingdost.shipping;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import com.shippingdost.shipping.model.*;
import com.shippingdost.shipping.service.ShippingService;

import static org.junit.jupiter.api.Assertions.*;

class ShippingServiceTest {

    private final ShippingService shippingService = new ShippingService();

    // Testing different scenarios: Van, Truck, Flight and Gold/Silver tiers
    @ParameterizedTest(name = "Check {0}km, {1} Tier: Expecting {2} (Speed: {3})")
    @CsvSource({
        "45,  GOLD,   143.0, standard", // Distance < 100 so Van logic
        "150, SILVER, 312.0, standard", // Distance > 100 so Truck logic
        "600, GOLD,   608.0, standard", // Distance > 500 so Flight logic
        "45,  GOLD,   144.2, express",  // Adding extra charge for speed
        "200, SILVER, 412.0, standard"  
    })
    void testShippingCalculations(double distance, Tier tier, double expected, String speed) {
        // Set up the data
        Customer customer = new Customer();
        customer.setTier(tier);
        
        Product product = new Product();
        product.setWeight(1.0); // Simple 1kg for easy checking

        // Run the calculation
        double result = shippingService.calculateFinalCharge(customer, product, distance, speed);

        // Result should match our expected value
        assertEquals(expected, result, 0.01, "Calculation is wrong for " + distance + "km");
    }
}