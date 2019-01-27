---
layout: post
bannercolor: "red darken-4"
title:  "Programmatic Queries using JPA Criteria API"
date:   2018-06-26
meta: "Criteria Queries are type-safe and portable. They are written using Java programming language APIs. They use the abstract schema of the persistent entities to find, modify and delete persistent entities."
excerpt: "Criteria Queries are type-safe and portable. They are written using Java programming language APIs. They use the abstract schema of the persistent entities to find, modify and delete persistent entities."
category: jpa
comments: false
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: igagrock
image: ts.jpeg

---

Java Persistence API (JPA) provides specification of managing data, such as accessing and persisting data, between Java Objects and the databases.

There are obviously many ways in JPA that could be used to interact with database such as JPQL(Java Persistence Query Language), Criteria API, and Entity specific methods such as persist, merge, remove, flush etc.

I initially found Criteria API pretty intimidating. I just couldn't grasp it. To be honest, I had to invest quite some time to figure out how it works. It eventually turned out to be quite fluent and simple API and I thought why not just write about the experiences I had while learning it. So here it is, **"Creating Programmatic Queries using JPA Criteria API"**.

Criteria Queries are type-safe and portable. They are written using Java programming language APIs. They use the abstract schema of the persistent entities to find, modify and delete persistent entities by invoking JPA Entity Operations.

Below is the Data Model, we will be using in this tutorial.

![Object Model- UML](/assets/images/Criteria-object-UML.png)
*<ins>UML diagram describing the Object Relationship Mapping</ins>*

We have three Objects( ref. to diagram above ) `Student` , `Course` and `Passport`. Each of the Objects have a relationship with each other:
* `Student` has a `One-To-One` relationship with `Passport`. It means that Each Student can only have one Passport and vice versa.
* `Student` has a `One-To-Many` relationship with `Address` which means that a Student can have one or more addresses and an address is always assigned to one student.
* `Student` has a `Many-To-Many` relationship with `Course` which means that Each Student can enroll in many courses and one course can have many Students enrolled.

We will start with simple Criteria Query and slowly build upon it more complex queries. 

```java
    public Long getStudentsCount() {
    		
    	/** CriteriaBuilder instance**/ 
    	CriteriaBuilder builder = entityManager.getCriteriaBuilder();
    	
    	/** create a criteriaQuery Object **/
    	CriteriaQuery<Long> studentQuery = builder.createQuery(Long.class);
    	
    	/** create a Root Object -> references to the queried entity **/
    	Root<Student> studentRoot = studentQuery.from(Student.class);
    	
    	/** Path Object to refer the attribute name of entity **/
        /** we are not using it for now **/
    	Path<Object> namePath = studentRoot.get("name");
    	
    	/** Aggregate Expression for count operation  **/
    	Expression<Long> countExpression = builder.count(studentRoot);
    	
    	/** **/
    	studentQuery.select(countExpression);
    	
    	/** instance of Typed Query */
    	TypedQuery<Long> typedStudentQuery = 
            				entityManager.createQuery(studentQuery);
    	
    	/** return the result **/
		Long count = typedStudentQuery.getSingleResult();
    	
    	return count;
    }
```

The above code example fetches the total count of students present in database.
I will describe each of the lines in the below steps:
* A `CriteriaBuilder` instance has all the required methods to build a Query.
* `CriteriaQuery` interface defines functionality required to build a top level query . It contains the methods that specify the item(s) to be returned in the query result, restrict the result based on certain conditions, group results , specify an order for the result and [much more](https://docs.oracle.com/javaee/6/api/javax/persistence/criteria/CriteriaQuery.html).
* `Root` interface represents the root entities involved in the query. There could be multiple roots defined a Criteria Query. 
* `Path` interface represents the path to the attribute in the `root` entity.
    `Path` interface also `extends` to `Expression` Interface which contains methods that return Predicates.
*  `builder.count()` method returns an expression which would be used for `Selection` of the result.
*  A `TypedQuery` instance is required to run the `CriteriaQuery`. 

> _If you are unable to grasp until now. Well, hold on to the rest of the tutorial, I will try my best to explain the API and the interface relationships. It would basically give you a complete picture of how various interfaces in Criteria API extend from one another and how it makes sense to use a path where an Expression is required or use a root in parameters where a path is expected._


The final output of the above example is below :)

```sql
    select
        count(student0_.id) as col_0_0_ 
    from
        student student0_
```
 
It seems quite the over work--doesn't it. The output of so many lines of code is just a plain old `SELECT` query. But the Criteria API was created to serve a different purpose i.e _programmable Query API_. It helps to build queries dynamically. You could write just one program to build queries for all objects in your application or build queries depending upon your business logic.

Let's say, we want to get the count of either Students, Courses or any other entities present in our application. We could either write different queries for each of them or we could only use Criteria API.

```java
public <T> Long getCountOfEntity(Class<T> claz) {
    		
    	CriteriaBuilder builder = em.getCriteriaBuilder();
    	CriteriaQuery<Long> studentQuery = builder.createQuery(Long.class);
    	Root<T> root = studentQuery.from(claz);
    	Expression<Long> countExpression = builder.count(root);
    	studentQuery.select(countExpression);
    	TypedQuery<Long> typedStudentQuery = em.createQuery(studentQuery);
    	
    	return typedStudentQuery.getSingleResult();
    }
```

I have only updated the previous example to allow the generic parameter which specifies the `Class` of the `Entity`. Rest of the Code stays same. You can learn more about Java Generics [here](https://docs.oracle.com/javase/tutorial/java/generics/index.html).

Before we move on to our next example, let's see how the Criteria API works.

```java
	 CriteriaQuery<T> createQuery(Class<T> resultClass);
```
`CreateQuery` method takes the `Class` name of the result type as an argument. I will describe the abstract meaning it below.
* If the result is returned as a data-set related to the entity e.g all the students or one of the  student. The parameter should be `Student.class`.
	```java 
        builder.createQuery(Student.class);
    ```
* If the query returns any other result irrespective of which entity it works on, It should have a parameter of the returned type. As we saw above, when the count was returned, the parameter type was 
	```java
		builder.createQuery(Long.class);
    ```

```java
	Root<T> root = studentQuery.from(Student.Class)
```
The `Root` refers to the entity one which the query would be run such as `Student.class` in the above example.

```java
	studentQuery.select(countExpression);	
```

The `select` method specifies the result to be returned by the Query. If we want to return all the rows of the entity instead of just returning the count, we could pass the `root` entity as the parameter such as below.

```java
	studentQuery.select(root);	
```


#### Relationship
![Interface relationships in Criteria API](/assets/images/apidaigram.png)
*<ins>Interface relationships in Criteria API</ins>*