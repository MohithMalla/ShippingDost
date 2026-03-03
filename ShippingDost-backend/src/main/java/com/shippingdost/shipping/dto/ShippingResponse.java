package com.shippingdost.shipping.dto;

import com.shippingdost.shipping.model.Location;

import lombok.*;

@Data
@Builder
public class ShippingResponse {
    private double shippingCharge;
    private double distance;      // Added to show in UI
    private String transportMode; // Added to show in UI
    private NearestWarehouseDTO nearestWarehouse;

    @Data
    @AllArgsConstructor
    public static class NearestWarehouseDTO {
        private Long warehouseId;
        private String warehouseName;
        private Location warehouseLocation;
    }
}