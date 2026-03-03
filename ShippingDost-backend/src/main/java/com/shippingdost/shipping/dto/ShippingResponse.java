package com.shippingdost.shipping.dto;

import com.shippingdost.shipping.model.Location;
import lombok.*;

// This goes back to the Frontend to show results
@Data
@Builder
public class ShippingResponse {
    private double shippingCharge;
    private double distance; 
    private String transportMode; 
    private NearestWarehouseDTO nearestWarehouse;

    @Data
    @AllArgsConstructor
    public static class NearestWarehouseDTO {
        private Long warehouseId;
        private String warehouseName;
        private Location warehouseLocation;
    }
}