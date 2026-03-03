package com.shippingdost.shipping.dto;

import lombok.Data;

@Data
public class ShippingRequest {
    private Long sellerId;
    private Long customerId;
    private Long productId;
    private String deliverySpeed; // "standard" or "express"
}