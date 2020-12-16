package com.code.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.code.ecommerce.entity.Customer;

public interface CustomerRespository extends JpaRepository<Customer, Long> {

}
