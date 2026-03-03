package com.shippingdost.shipping.utils;

import com.shippingdost.shipping.model.Location;

public class DistanceEstimator {
    public static double calculateDistance(Location loc1, Location loc2) {
        double earthRadius = 6371; // Kilometers
        double dLat = Math.toRadians(loc2.getLat() - loc1.getLat());
        double dLng = Math.toRadians(loc2.getLng() - loc1.getLng());
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(loc1.getLat())) * Math.cos(Math.toRadians(loc2.getLat())) *
                   Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }
}