package com.code.ecommerce.service;

import com.code.ecommerce.dto.Purchase;
import com.code.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

	PurchaseResponse placeOrder(Purchase purchase);
}
