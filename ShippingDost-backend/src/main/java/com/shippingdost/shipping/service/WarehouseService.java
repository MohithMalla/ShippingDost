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

    public Warehouse findNearestWarehouse(Location sellerLocation) {
        List<Warehouse> warehouses = warehouseRepo.findAll();
        Warehouse nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (Warehouse wh : warehouses) {
            double dist = DistanceEstimator.calculateDistance(sellerLocation, wh.getLocation());
            if (dist < minDistance) {
                minDistance = dist;
                nearest = wh;
            }
        }
        return nearest;
    }
}