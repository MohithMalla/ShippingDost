package com.shippingdost.shipping.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shippingdost.shipping.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}