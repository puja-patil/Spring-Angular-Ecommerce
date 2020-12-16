package com.code.ecommerce.service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.code.ecommerce.dao.CustomerRespository;
import com.code.ecommerce.dto.Purchase;
import com.code.ecommerce.dto.PurchaseResponse;
import com.code.ecommerce.entity.Customer;
import com.code.ecommerce.entity.Order;
import com.code.ecommerce.entity.OrderItem;

@Service
public class CheckoutServiceImpl implements CheckoutService {

	@Autowired
	private CustomerRespository customerRepository;

//	public CheckoutServiceImpl(CustomerRespository customerRespository) {
//		this.customerRepository = customerRespository;
//	}

	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {
		// retrieve order from dto
		Order order = purchase.getOrder();

		// generate tracking number
		String trackingNumber = generateOrderTrackingNumber();
		order.setOrderTrackingNumber(trackingNumber);

		// populate order with order items
//		order.setOrderItems(purchase.getOrderItems());
		Set<OrderItem> orderItems = purchase.getOrderItems();
		orderItems.forEach(item->order.addItem(item));
		order.setOrderItems(orderItems);

		// populate order wiht shipping address and billing adresss
		order.setBillingAddress(purchase.getBillingAddress());
		order.setShippingAddress(purchase.getShippingAddress());

		// populate customer with order
		Customer customer = purchase.getCustomer();
		customer.addOrder(order);

		// save to db
		customerRepository.save(customer);

		// return response
		return new PurchaseResponse(trackingNumber);
	}

	private String generateOrderTrackingNumber() {
		// generate random UUID number
		// for details -- https://en.wikipedia.org/wiki/Universally_unique_identifier
		return UUID.randomUUID().toString();
	}

}
