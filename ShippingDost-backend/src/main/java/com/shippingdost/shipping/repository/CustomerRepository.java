package com.shippingdost.shipping.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shippingdost.shipping.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> { }