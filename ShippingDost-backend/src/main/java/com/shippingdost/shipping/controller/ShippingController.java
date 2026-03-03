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
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173") 
@RestController
@RequestMapping("/api/v1")
public class ShippingController {

    @Autowired private WarehouseService warehouseService;
    @Autowired private ShippingService shippingService;
    @Autowired private AuditLogRepository auditRepo;
    @Autowired private CustomerRepository customerRepo;
    @Autowired private SellerRepository sellerRepo;
    @Autowired private ProductRepository productRepo;
    @Autowired private WarehouseRepository warehouseRepo;

    // To find which warehouse is close to the seller
    @GetMapping("/warehouse/nearest")
    public Warehouse getNearest(@RequestParam Long sellerId) {
        Seller seller = sellerRepo.findById(sellerId)
            .orElseThrow(() -> new RuntimeException("Seller missing in DB"));
        return warehouseService.findNearestWarehouse(seller.getLocation());
    }

    // Direct check for shipping charge
    @GetMapping("/shipping-charge")
    public ResponseEntity<Map<String, Double>> getShippingCharge(
            @RequestParam Long warehouseId, 
            @RequestParam Long customerId, 
            @RequestParam String deliverySpeed) {
        
        Warehouse warehouse = warehouseRepo.findById(warehouseId).orElseThrow();
        Customer customer = customerRepo.findById(customerId).orElseThrow();
        Product defaultProduct = productRepo.findAll().stream().findFirst().orElseThrow(); 

        double dist = DistanceEstimator.calculateDistance(warehouse.getLocation(), customer.getLocation());
        double charge = shippingService.calculateFinalCharge(customer, defaultProduct, dist, deliverySpeed);

        return ResponseEntity.ok(Map.of("shippingCharge", charge));
    }

    // Main logic for calculating everything and saving to history
    @PostMapping("/shipping-charge/calculate")
    public ShippingResponse calculate(@RequestBody ShippingRequest request) {
        Customer customer = customerRepo.findById(request.getCustomerId()).orElseThrow();
        Seller seller = sellerRepo.findById(request.getSellerId()).orElseThrow();
        Product product = productRepo.findById(request.getProductId()).orElseThrow();

        Warehouse nearest = warehouseService.findNearestWarehouse(seller.getLocation());
        double distance = DistanceEstimator.calculateDistance(nearest.getLocation(), customer.getLocation());
        
        // Checking distance and deciding how to send
        String mode = (distance > 500) ? "AEROPLANE" : (distance > 100) ? "TRUCK" : "MINI_VAN";
        
        double charge = shippingService.calculateFinalCharge(customer, product, distance, request.getDeliverySpeed());

        // Saving the record so we can see in dashboard
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

    // For showing history in frontend
    @GetMapping("/shipping-charge/history")
    public List<AuditLog> getHistory() {
        return auditRepo.findAll();
    }

    @GetMapping("/customers")
    public List<Customer> getAllCustomers() { return customerRepo.findAll(); }

    @GetMapping("/sellers")
    public List<Seller> getAllSellers() { return sellerRepo.findAll(); }

    @GetMapping("/products")
    public List<Product> getAllProducts() { return productRepo.findAll(); }
}