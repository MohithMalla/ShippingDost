package com.shippingdost.shipping.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shippingdost.shipping.model.AuditLog;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // Enables the Dashboard to filter by Air, Truck, or Van
    List<AuditLog> findByTransportMode(String transportMode);
}