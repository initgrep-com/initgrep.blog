---
layout: post
bannercolor: "red dark-4"
title:  "write join queries using jpa criteria queries"
date:   2023-08-13
meta: "Learn how to create join queries using JPA Criteria Queries easily. Explore a beginner-friendly guide to crafting effective join queries and improving your database querying skills with JPA's criteria API. "
excerpt: "Learn how to create join queries using JPA Criteria Queries easily. Explore a beginner-friendly guide to crafting effective join queries and improving your database querying skills with JPA's criteria API. "
category: jpa
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: irshsheik
image: joins.jpg
categories:
    - jpa
    - java
    - all
---

In this blog post, we'll explore how to effectively use JPA's criteria API to combine information from different database tables, enhancing your ability to retrieve and work with interconnected data.

### The Essence of Joins

At its core, a join merges rows from two or more tables based on a related column between them. This operation provides a  link between data that would otherwise exist in isolated silos. By seamlessly integrating information from different tables, joins facilitate comprehensive data analysis and enhance the granularity of queries.

### Left Joins: Bridging the Data Divide

**Scenario: Customer-Order Association**

Consider a situation where you're managing a database of customers and their corresponding orders. In some instances, customers may not have placed any orders yet. To retrieve a list of all customers and their orders, regardless of whether orders exist, a left join comes to the rescue.

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Customer> query = cb.createQuery(Customer.class);
Root<Customer> customerRoot = query.from(Customer.class);
Join<Customer, Order> orderJoin = customerRoot.join("orders", JoinType.LEFT);
query.select(customerRoot).distinct(true);

```

In this code snippet:

1. **`orderJoin: Join<Customer, Order>`** establishes a left join between the **`Customer`** and **`Order`** entities, ensuring customers are fetched alongside their orders.
2. The argument **`'orders'`** passed to **`join()`** identifies the property on the **`Customer`** entity representing the relationship with the **`Order`** entity.
3. **`JoinType.LEFT`** specifies a left join operation.
4. **`query.select(customerRoot).distinct(true)`** signifies the selection of **`Customer`** entities and the utilization of the **`distinct`** modifier to eliminate duplicate customers from the result set.

The generated SQL query resembles this:

```sql
SELECT DISTINCT c.*
FROM customer c
LEFT JOIN order o ON c.id = o.customer_id;

```

### Right Joins: Shifting the Focus

**Scenario: Product-Order Association**

Imagine a scenario where you're interested in determining products that have yet to receive any orders. This situation calls for a right join, focusing on data from the associated table to lead the way.

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Product> query = cb.createQuery(Product.class);
Root<Product> productRoot = query.from(Product.class);
Join<Product, Order> orderJoin = productRoot.join("orders", JoinType.RIGHT);
query.select(productRoot).distinct(true);

```

Here, the spotlight shifts to products, and the right join captures products that are yet to find placement within an order. The corresponding SQL query takes form:

```sql
SELECT DISTINCT p.*
FROM product p
RIGHT JOIN order o ON p.id = o.product_id;

```

### Full Joins: Embracing Data Wholeness

**Scenario: Author-Book Relationship**

Imagine a situation where you're examining the relationship between authors and their published books. A full join brings together the benefits of left and right joins, combining information from both tables to provide a comprehensive overview.

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Author> query = cb.createQuery(Author.class);
Root<Author> authorRoot = query.from(Author.class);
Join<Author, Book> bookJoin = authorRoot.join("books", JoinType.FULL);
query.select(authorRoot).distinct(true);

```

With a full join, the endeavor of gathering insights about authors and their books encompasses both published and unpublished works. The SQL counterpart takes shape:

```sql
SELECT DISTINCT a.*
FROM author a
FULL JOIN book b ON a.id = b.author_id;

```