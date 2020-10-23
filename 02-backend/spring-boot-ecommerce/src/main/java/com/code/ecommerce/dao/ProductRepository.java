package com.code.ecommerce.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import com.code.ecommerce.entity.Product;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {
	
	Page<Product> findByCategoryId(@RequestParam Long id , Pageable pageable);
	
	Page<Product> findByNameContaining(@RequestParam String name , Pageable pageable);
	/*select * from product p where p.name LIKE CONCAT('%',:name,'%')*/

}
