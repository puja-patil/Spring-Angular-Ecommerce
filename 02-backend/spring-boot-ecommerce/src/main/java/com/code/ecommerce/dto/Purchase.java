package com.code.ecommerce.dto;

import java.util.HashSet;
import java.util.Set;

import com.code.ecommerce.entity.Address;
import com.code.ecommerce.entity.Customer;
import com.code.ecommerce.entity.Order;
import com.code.ecommerce.entity.OrderItem;

import lombok.Data;

@Data
public class Purchase {
	private Customer customer;
	
	private Address shippingAddress;
	
	private Address billingAddress;
	
	private Order order;
	
	private Set<OrderItem> orderItems = new HashSet<OrderItem>();
}
