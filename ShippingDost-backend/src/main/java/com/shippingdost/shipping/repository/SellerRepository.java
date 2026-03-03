package com.shippingdost.shipping.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shippingdost.shipping.model.Seller;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
}