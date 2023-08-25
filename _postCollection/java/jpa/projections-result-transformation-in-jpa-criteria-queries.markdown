---
layout: post
bannercolor: "red dark-4"
title: "Projections and Result Transformations in JPA Criteria Queries"
date: 2023-08-13 17:00:00 +0200
meta: "Optimize JPA queries with projections & result transformations. Learn efficient data retrieval & customization in Java Persistence API. Real examples included."
excerpt: "Optimize JPA queries with projections & result transformations. Learn efficient data retrieval & customization in Java Persistence API. Real examples included."
category: jpa
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: irshsheik
image: /assets/images/proj.jpg
categories:
    - jpa
    - java
    - all
---

When you're working with JPA (Java Persistence API) to get info from a database, you don't always need everything. Sometimes, you just want only a certain parts of data, like special columns. That's where JPA's projections and result changes come in to picture. In this blog post, we'll explore these ideas and see how they can help you get the data you need and adjust your search results to fit what you want.

## Understanding Projections

Projections in JPA criteria queries refer to the ability to select specific columns or attributes from entities, rather than fetching the entire entity. This can significantly improve query performance and reduce unnecessary data transfer. The Criteria API provides a flexible way to achieve this by using the `CriteriaBuilder` and `CriteriaQuery` interfaces.

Let's consider a scenario with two entities: `Customer` and `Order`.

```java
@Entity
public class Customer {
    @Id
    @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;
    // Other fields, getters, and setters
}

@Entity
public class Order {
    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    private Customer customer;
    private LocalDate orderDate;
    // Other fields, getters, and setters
}

```

Suppose you want to retrieve only the names of customers who have placed orders. Here's how you can achieve this using projections:

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<String> query = cb.createQuery(String.class);

Root<Order> orderRoot = query.from(Order.class);
Join<Order, Customer> customerJoin = orderRoot.join("customer");

query.select(customerJoin.get("firstName"));

List<String> customerNames = entityManager.createQuery(query).getResultList();

```

**Equivalent SQL Query**:

```sql
SELECT c.first_name
FROM order o
JOIN customer c ON o.customer_id = c.id;

```

In this example, `customerJoin.get("firstName")` specifies the projection, indicating that only the `firstName` attribute of the `Customer` entity should be retrieved.

## Result Transformations

While projections help in fetching specific attributes, sometimes you might need to transform the query results into custom Java objects that hold a subset of data from multiple entities. This is particularly useful when you want to create DTOs (Data Transfer Objects) or encapsulate calculated values from the query.

Continuing with our `Customer` and `Order` entities, let's say you want to retrieve a list of objects containing customer names and the total number of orders they've placed. Here's how result transformations can be used:

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Object[]> query = cb.createQuery(Object[].class);

Root<Order> orderRoot = query.from(Order.class);
Join<Order, Customer> customerJoin = orderRoot.join("customer");

query.multiselect(customerJoin.get("firstName"), cb.count(orderRoot));
query.groupBy(customerJoin.get("firstName"));

List<Object[]> results = entityManager.createQuery(query).getResultList();

List<CustomerOrderSummary> summaries = new ArrayList<>();
for (Object[] result : results) {
    summaries.add(new CustomerOrderSummary((String) result[0], (Long) result[1]));
}

```

**Equivalent SQL Query**:

```sql
SELECT c.first_name, COUNT(o.id)
FROM order o
JOIN customer c ON o.customer_id = c.id
GROUP BY c.first_name;

```

In this example, we've defined a class `CustomerOrderSummary` to hold the transformation result:

```java
public class CustomerOrderSummary {
    private String customerName;
    private Long orderCount;

    public CustomerOrderSummary(String customerName, Long orderCount) {
        this.customerName = customerName;
        this.orderCount = orderCount;
    }

    // Getters and setters
}

```

By using the `multiselect` method, we've specified the attributes we want to retrieve and transform in the query results. The `groupBy` clause groups the results by customer names.