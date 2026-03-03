package com.shippingdost.shipping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shippingdost.shipping.dto.*;
import com.shippingdost.shipping.model.*;
import com.shippingdost.shipping.repository.*;
import com.shippingdost.shipping.service.*;
import com.shippingdost.shipping.utils.DistanceEstimator;

import java.util.List;
import java.util.Map; // ADDED: Missing import for Requirement 2

/**
 * Enterprise-grade Controller for Jumbotail Shipping Estimator.
 * Handles B2B logistics between Sellers, Warehouses, and Kirana Stores.
 */
@CrossOrigin(origins = "http://localhost:5173") 
@RestController
@RequestMapping("/api/v1")
public class ShippingController {

    @Autowired private WarehouseService warehouseService;
    @Autowired private ShippingService shippingService;
    @Autowired private AuditLogRepository auditRepo;
    
    // Repositories needed for real data lookup
    @Autowired private CustomerRepository customerRepo;
    @Autowired private SellerRepository sellerRepo;
    @Autowired private ProductRepository productRepo;
    @Autowired private WarehouseRepository warehouseRepo; // ADDED: Missing repository declaration

    /**
     * Requirement 1: Get Nearest Warehouse for a Seller
     */
    @GetMapping("/warehouse/nearest")
    public Warehouse getNearest(@RequestParam Long sellerId) {
        Seller seller = sellerRepo.findById(sellerId)
            .orElseThrow(() -> new RuntimeException("Seller not found"));
        return warehouseService.findNearestWarehouse(seller.getLocation());
    }

    /**
     * Requirement 2: Get Shipping Charge for a Warehouse and Customer
     */
    @GetMapping("/shipping-charge")
    public ResponseEntity<Map<String, Double>> getShippingCharge(
            @RequestParam Long warehouseId, 
            @RequestParam Long customerId, 
            @RequestParam String deliverySpeed) {
        
        // 1. Fetch entities from DB
        Warehouse warehouse = warehouseRepo.findById(warehouseId)
            .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        Customer customer = customerRepo.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // 2. Use first product found to determine weight/attributes
        Product defaultProduct = productRepo.findAll().stream().findFirst()
            .orElseThrow(() -> new RuntimeException("No products found in database")); 

        // 3. Calculate distance and charge
        double dist = DistanceEstimator.calculateDistance(warehouse.getLocation(), customer.getLocation());
        double charge = shippingService.calculateFinalCharge(customer, defaultProduct, dist, deliverySpeed);

        return ResponseEntity.ok(Map.of("shippingCharge", charge));
    }

    /**
     * Requirement 3: Calculate full shipping charges for a Seller-Customer pair
     */
    @PostMapping("/shipping-charge/calculate")
public ShippingResponse calculate(@RequestBody ShippingRequest request) {
    Customer customer = customerRepo.findById(request.getCustomerId()).orElseThrow();
    Seller seller = sellerRepo.findById(request.getSellerId()).orElseThrow();
    Product product = productRepo.findById(request.getProductId()).orElseThrow();

    Warehouse nearest = warehouseService.findNearestWarehouse(seller.getLocation());
    double distance = DistanceEstimator.calculateDistance(nearest.getLocation(), customer.getLocation());
    
    // Determine Transport Mode
    String mode = (distance > 500) ? "AEROPLANE" : (distance > 100) ? "TRUCK" : "MINI_VAN";
    
    double charge = shippingService.calculateFinalCharge(customer, product, distance, request.getDeliverySpeed());

    // Save detailed audit
    auditRepo.save(AuditLog.builder()
            .customerId(customer.getId())
            .sellerId(seller.getId())
            .warehouseId(nearest.getId())
            .warehouseName(nearest.getName())
            .distance(distance)
            .transportMode(mode)
            .finalCharge(charge)
            .build());

    return ShippingResponse.builder()
            .shippingCharge(charge)
            .distance(distance)
            .transportMode(mode)
            .nearestWarehouse(new ShippingResponse.NearestWarehouseDTO(
                nearest.getId(), nearest.getName(), nearest.getLocation()))
            .build();
}

    /**
     * Dashboard Data: Get all previous calculation history
     */
    @GetMapping("/shipping-charge/history")
    public List<AuditLog> getHistory() {
        return auditRepo.findAll();
    }
    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    @GetMapping("/sellers")
    public List<Seller> getAllSellers() {
        return sellerRepo.findAll();
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }
    @GetMapping("/shipping-charge/history/filter")
public List<AuditLog> getFilteredHistory(@RequestParam String mode) {
    return auditRepo.findByTransportMode(mode.toUpperCase());
}
}