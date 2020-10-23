package com.code.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import com.code.ecommerce.entity.Country;
import com.code.ecommerce.entity.Product;
import com.code.ecommerce.entity.ProductCategory;
import com.code.ecommerce.entity.State;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

	private EntityManager entityManager;

	@Autowired
	public MyDataRestConfig(EntityManager entityManager) {
		this.entityManager = entityManager;
	};

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		// TODO Auto-generated method stub
		HttpMethod[] theUnsupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE };

		// disable http methos doe ProductCategory: PUT,POST,DELETE
		disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);
		disableHttpMethods(Product.class, config, theUnsupportedActions);
		disableHttpMethods(Country.class, config, theUnsupportedActions);
		disableHttpMethods(State.class, config, theUnsupportedActions);

		// call an intenal helper method to expose category ids
		exposeIds(config);
	}

	private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config,
			HttpMethod[] theUnsupportedActions) {
		config.getExposureConfiguration().forDomainType(theClass)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
	}

	private void exposeIds(RepositoryRestConfiguration config) {
		// expose entity ids

		// get a list of all entity classes from entity manager
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

		// create an arraylist of entitytypes
		List<Class> entityClasses = new ArrayList<>();

		for (EntityType tempEntity : entities) {
			// System.out.println(tempEntity.getName()+" "+tempEntity.getJavaType());
			entityClasses.add(tempEntity.getJavaType());
		}

		// expose the entity ids for entity/domain type
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);

	}

}
