package com.code.ecommerce.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "order_tracking_number")
	private String orderTrackingNumber;

	@Column(name = "total_quantity")
	private int totalQuantity;

	@Column(name = "total_price")
	private BigDecimal totalPrice;

	@Column(name = "status")
	private String status;

	@Column(name = "date_created")
	@CreationTimestamp
	private Date dateCreated;

	@Column(name = "last_updated")
	@LastModifiedDate
	private Date lastUpdates;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
	private Set<OrderItem> orderItems = new HashSet<OrderItem>();
	
	@ManyToOne
	@JoinColumn(name = "customer_id")
	private Customer customer;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "shipping_address_id",referencedColumnName = "id")
	private Address shippingAddress;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "billing_address_id",referencedColumnName = "id")
	private Address billingAddress;

	public void addItem(OrderItem item) {
		if (item != null) {
			if (orderItems != null) {
				orderItems = new HashSet<OrderItem>();
			}
			orderItems.add(item);
			item.setOrder(this);
		}
	}

}
