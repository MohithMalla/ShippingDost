package com.shippingdost.shipping.dto;

import lombok.Data;

// This is what we get from Frontend React app
@Data
public class ShippingRequest {
    private Long sellerId;
    private Long customerId;
    private Long productId;
    private String deliverySpeed; // standard or express
}