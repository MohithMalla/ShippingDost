package com.shippingdost.shipping.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shippingdost.shipping.model.Location;
import com.shippingdost.shipping.model.Warehouse;
import com.shippingdost.shipping.repository.WarehouseRepository;
import com.shippingdost.shipping.utils.DistanceEstimator;

import java.util.List;

@Service
public class WarehouseService {

    @Autowired
    private WarehouseRepository warehouseRepo;

    // This logic finds which warehouse is nearest to the seller
    public Warehouse findNearestWarehouse(Location sellerLocation) {
        // Get all warehouses from DB first
        List<Warehouse> warehouses = warehouseRepo.findAll();
        Warehouse nearest = null;
        double minDistance = Double.MAX_VALUE;

        // Loop through everything and check distance one by one
        for (Warehouse wh : warehouses) {
            double dist = DistanceEstimator.calculateDistance(sellerLocation, wh.getLocation());
            
            // If this one is closer than the previous one, update it
            if (dist < minDistance) {
                minDistance = dist;
                nearest = wh;
            }
        }
        
        // Return the final nearest warehouse object
        return nearest;
    }
}