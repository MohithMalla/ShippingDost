package com.shippingdost.shipping.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shippingdost.shipping.model.AuditLog;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // Custom query to filter by Air, Truck etc. if needed
    List<AuditLog> findByTransportMode(String transportMode);
}