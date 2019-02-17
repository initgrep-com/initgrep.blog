---
layout: post
bannercolor: "red dark-2"
title:  "Programmatic Criteria Queries using JPA Criteria API"
date:   2019-02-11
meta: "Criteria Queries in JPA are type-safe and portable way of fetching data. It provides methods such as Criteria Join, Fetch Join, aggregate functions and sub queries to fetch data."
excerpt: "Criteria Queries in JPA are type-safe and portable way of fetching data. It provides methods such as Criteria Join, Fetch Join, aggregate functions and sub queries to fetch data."
category: jpa
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: igagrock
image: cq1.jpg

---

Java Persistence API (JPA) provides the specification of managing data, such as accessing and persisting data, between Java Objects and the databases.

There are obviously many ways in JPA that could be used to interact with a database such as JPQL(Java Persistence Query Language), Criteria API, and Entity specific methods such as persist, merge, remove, flush etc.

I initially found Criteria API quite intimidating. To be frank, I had to invest quite some time to figure it out. It eventually turned out to be quite fluent API. I thought why not just write about the experiences. So here it is, **"Creating Programmatic Criteria Queries using JPA Criteria API"**.

Criteria Queries are type-safe and portable. They are written using Java programming language APIs. They use the abstract schema of the persistent entities to find, modify and delete persistent entities by invoking JPA Entity Operations.


&nbsp;

We will be using the following domain model for building the criteria queries in this tutorial.

![Object Model- UML](/assets/images/Criteria-object-UML.png)
*<ins>UML diagram describing the Object Relationship Mapping</ins>*

We have three Objects( ref. to diagram above ) `Student` , `Course` and `Passport`. Each of the Objects has a relationship with each other:
* `Student` has a `One-To-One` relationship with `Passport`. It means that Each Student can only have one Passport and vice versa.
* `Student` has a `One-To-Many` relationship with `Address` which means that a Student can have one or more addresses and an address is always assigned to one student.
* `Student` has a `Many-To-Many` relationship with `Course` which means that Each Student can enroll in many courses and one course can have many Students enrolled.

{% include ads/article-ads.html %}
&nbsp;

We will begin with a simple Criteria Query and slowly try to build upon it. 

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

_The above code example retrieves the total count of students present in the database._


Criteria queries are an Object graph where each part of the graph represents an atomic part of the query. The various steps in building the object graph roughly translates to the following steps.

* A `CriteriaBuilder` interface contains all the required methods to build Criteria Queries, Expressions, Ordering, and Predicates.
* `CriteriaQuery` interface defines functionality required to build a top-level query. The type specified for criteria query i.e `criteriaQuery<Class<T> resultClass>` would be the type of the result returned. If no type is provided, the type of result would be `Object`. Criteria Query contains the methods that specify the item(s) to be returned in the query result, restrict the result based on certain conditions, group results, specify an order for the result and [much more](https://docs.oracle.com/javaee/6/api/javax/persistence/criteria/CriteriaQuery.html).
* `Root` interface represents the root entities involved in the query. There could be multiple roots defined in the Criteria Query. 
* `Path` interface represents the path to the attribute in the `root` entity.
    `Path` interface also `extends` to `Expression` Interface which contains methods that return Predicates.
*  `builder.count()` is an aggregate method. It returns an expression which would be used for `Selection` of the result. When aggregate methods are used as arguments in `select` method, the type of the query should match the return type of aggregate method.
*  A `TypedQuery` instance is required to run the `CriteriaQuery`. 

The final output of the above example is below :)

```sql
    select
        count(student0_.id) as col_0_0_ 
    from
        student student0_
```
 
__It seems quite the over work--doesn't it.__ The output of so many lines of code is just a plain old `SELECT` query. But the Criteria API was created to serve a different purpose i.e _programmable Query API_. It helps to build queries dynamically. You could write just one program to build queries for all objects in your application or build queries depending upon your business logic.

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

I have only updated the previous example to allow the generic parameter which specifies the `Class` of the `Entity`. Rest of the Code stays the same. You can learn more about Java Generics [here](https://docs.oracle.com/javase/tutorial/java/generics/index.html).


Let's look at the above example in detail.

**Criteria Query**
```java
     CriteriaQuery<T> createQuery(Class<T> resultClass);
```
`CreateQuery` method takes the `Class` name of the result type as an argument. 
* If the result is returned as a data-set related to the entity e.g all the students or one of the student. The parameter should be `Student.class`. 
```java 
        builder.createQuery(Student.class);
    ```
* If the query returns any other result irrespective of which entity it works on, It should have a parameter of the returned type. As we saw above, when the count was returned, the parameter type was  `Long.class`

```java
    builder.createQuery(Long.class);
```

**Root**
```java
    Root<T> root = studentQuery.from(Student.Class)
```
The `Root` refers to the entity on which the query would be run such as `Student.class` in the above example.

**Select**

```java
    studentQuery.select(countExpression);    
```

The `select` method specifies the result to be returned by the Query. If all the attributes of an entity are supposed to be returned instead of just returning the count, we could pass the `root` entity as the parameter such as below.

```java
    studentQuery.select(studentRoot);
```


&nbsp;
###  Inheritance Relationships

&nbsp;


![Interface relationships in Criteria API](/assets/images/apidaigram.png)
*<ins>Interface relationships in Criteria API</ins>*

In the Above diagram, observe the classes in a blue background. The relationship tree explains the inheritance hierarchy among various interfaces present in the Criteria API.

`Selection` is at the top and being extended by `Expression`. `Expression` in turn is being extended by `Predicate` and `Path` interfaces. `From` interface extends path which in turn is the parent of both `Root` and `Join` Interface.

`Root` Interface is also an expression. It means, we can query a complete entity by passing `Root` as a parameter to the `select` method.
In case we want to fetch a selected attribute, we can fetch the attribute path using `root.get(attributeName)`. This method returns a `Path`  object which inherits `expression`.    

{% include ads/article-ads.html %}
&nbsp;

### Criteria Joins

&nbsp;
#### Implicit Join 

```java
    root.get("addresses");
```
When a collection parameter is passed to the get method, it creates a path to corresponding referenced **collection-valued attribute**. This results in the creation of an `INNER JOIN` query.

Let's go back to our domain objects. `Student` has a `OneToMany` relationship with `Address`. To fetch the `address`, we can use the `root.get('address')`. Below is an example.

```java
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Student> cq = builder.createQuery(Student.class);
        Root<Student> root = cq.from(Student.class);
        cq.select(root.get("addresses"));
        em.createQuery(cq).getResultList();
```

Output Query for the above example looks like as below:

```java
   select
        addresses1_.id as id1_0_,
        addresses1_.city_code as city_cod2_0_,
        addresses1_.city_lang as city_lan3_0_,
        addresses1_.city_name as city_d nam4_0_,
        addresses1_.country as country5_0_,
        addresses1_.house_number as house_nu6_0_,
        addresses1_.street as street7_0_,
        addresses1_.student_id as student_9_0_,
        addresses1_.zip_code as zip_code8_0_ 
    from
        student student0_ 
    inner join
        address addresses1_ 
            on student0_.id=addresses1_.student_id
```

Note: Since the Address is the Owner of the relationship between Student and Address. By default, the fetch type for a `OneToMany` relationship is lazy fetch. As a result, there would be extra queries fired to initialize the Student entities related to each Address. However, If we add a where clause and specify a `restriction or predicate`, it would only result in a Single Query.

&nbsp;
#### Explicit Join

Ideally, when we define relationships in JPA, the Join will be based on the related ID column. However, if we want to define the restriction based on some other column, `Join.on(Predicate...)` can be used. `Join` also provides a way to traverse the attributes of the joined entity such as `join.get(attributeName)`.

```java
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Student> cq = builder.createQuery(Student.class);
        Root<Student> root = cq.from(Student.class);
        Join<Student, Address> join = root.join("addresses");
        /** the below statement is only for the illustration only.
            the join relationship will by-default be id and reference id
        **/
        join.on(builder.equal(root.get("id"), join.get("student")));
        cq.multiselect(join);
        List<Student> resultList = em.createQuery(cq).getResultList();
```

The output of the above code example is quite different than what we saw in the implicit join. The initial query only fetches the address id by doing the `INNER JOIN`. Each of the entities in the relationship is fetched lazily using separate queries

```java
   select
        addresses1_.id as col_0_0_ 
    from
        student student0_ 
    inner join
        address addresses1_ 
            on student0_.id=addresses1_.student_id 
```

After all the Id's are fetched, One query is used to fetch Student and Address details by doing an `OUTER JOIN` on Student id and address.Student_id.

```java
   select
        address0_.id as id1_0_0_,
        address0_.city_code as city_cod2_0_0_,
        address0_.city_lang as city_lan3_0_0_,
        address0_.city_name as city_nam4_0_0_,
        address0_.country as country5_0_0_,
        address0_.house_number as house_nu6_0_0_,
        address0_.street as street7_0_0_,
        address0_.student_id as student_9_0_0_,
        address0_.zip_code as zip_code8_0_0_,
        student1_.id as id1_4_1_,
        student1_.name as name2_4_1_,
        student1_.passport_id as passport3_4_1_ 
    from
        address address0_ 
    left outer join
        student student1_ 
            on address0_.student_id=student1_.id 
    where
        address0_.id=?
```
Note: If a restriction is provided in `where` method of the `CritieriaQuery`. It would result in a single query.

&nbsp;

####  Fetch Join

`FETCH` tells the JPA to override the declarative fetch definitions provided through annotation such as `@ManyToMany(fetch=FetchType.LAZY)` and initialize all the associations or relationships eagerly. As a result, only one query is created.

```java
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Student> cq = builder.createQuery(Student.class);
        Root<Student> root = cq.from(Student.class);
        root.fetch("addresses");
        cq.select(root);
        List<Student> resultList = em.createQuery(cq).getResultList();
```

_The above query output is only a single query as below:_

``` java
  select
        student0_.id as id1_4_0_,
        addresses1_.id as id1_0_1_,
        student0_.name as name2_4_0_,
        student0_.passport_id as passport3_4_0_,
        addresses1_.city_code as city_cod2_0_1_,
        addresses1_.city_lang as city_lan3_0_1_,
        addresses1_.city_name as city_nam4_0_1_,
        addresses1_.country as country5_0_1_,
        addresses1_.house_number as house_nu6_0_1_,
        addresses1_.street as street7_0_1_,
        addresses1_.student_id as student_9_0_1_,
        addresses1_.zip_code as zip_code8_0_1_,
        addresses1_.student_id as student_9_0_0__,
        addresses1_.id as id1_0_0__ 
    from
        student student0_ 
    inner join
        address addresses1_ 
            on student0_.id=addresses1_.student_id
```

{% include ads/article-ads.html %}
&nbsp;

### Group By and Having clause

`Group By` Clause is used to group rows with similar values. `Having` Clause is used to add restrictions for [aggregate functions](https://docs.oracle.com/database/121/SQLRF/functions003.htm#SQLRF20035). 

**GroupBy ---** method is part of the `CriteriaQuery` Interface. It either takes  one or a List of `Expressions` as parameters. These expressions are used to form groups over the query results. Below is the signature of the `groupBy` methods.

```java
    /*
    * @param grouping  zero or more grouping expressions
    * @return the modified query
    */
    CriteriaQuery<T> groupBy(Expression<?>... grouping);

    /*
    * @param grouping  list of zero or more grouping expressions
    * @return the modified query
    */
    CriteriaQuery<T> groupBy(List<Expression<?>> grouping);
```

&nbsp;

**Having ---** method is also part of the `CriteriaQuery` Interface. It either takes a simple or compound boolean `Expression` or one or more `Predicates` as parameters. The expression or predicates provided specify the restrictions over the groups of the query.
Below is the signature of the `having` methods.

```java
 /**
     * @param restriction  a simple or compound boolean expression
     * @return the modified query
     */
    CriteriaQuery<T> having(Expression<Boolean> restriction);

    /**
     * @param restrictions  zero or more restriction predicates
     * @return the modified query
     */
    CriteriaQuery<T> having(Predicate... restrictions);
```

&nbsp;

To build a Criteria Query which uses the `group by` and `having` methods--
Let's assume, we need to fetch all the `Students` with the number of `Addresses` greater than or equal to three(3). 

```java
    CriteriaBuilder builder = em.getCriteriaBuilder();
    CriteriaQuery<Student> cq = builder.createQuery(Student.class);
    /** Query the address entity **/
    Root<Address> root = cq.from(Address.class);
    /** join with student to fetch the student_id **/
    Join<Address, Student> joinOnStudent = root.join("student");
    /** count expression on the address_id **/
    Expression<Long> count = builder.count(root.get("id"));
    /** fetch students , group by student_id , habving count >= 3 **/
    cq.select(joinOnStudent)
        .groupBy(joinOnStudent.get("id"))
        .having(builder.ge(count, 3));

    List<Student> resultList = em.createQuery(cq).getResultList();
```

The output results in an SQL with an `INNER JOIN` between Student and Address on Student_id column. It fetches students with restrictions provided by `HAVING` clause on aggregate function mentioned by `Group By` clause.

```java
Hibernate: 
    select
        student1_.id as id1_4_,
        student1_.name as name2_4_,
        student1_.passport_id as passport3_4_ 
    from
        address address0_ 
    inner join
        student student1_ 
            on address0_.student_id=student1_.id 
    group by
        student1_.id 
    having
        count(address0_.id)>=3
```


&nbsp;
### Order By

The `order by` keyword is used to sort the fetched data either in ascending order or descending order of the value of a column. It can also include aggregate functions.

The `Order` interface provides the below methods 
* `reverse()` method switches the ordering.
* `isAscending()` checks whether ascending order is in place.
* `getExpression()` fetches the expression that is used for ordering.

&nbsp;

The `CriteriaBuilder` interface provides the following methods to enforce order in a criteria query.
* `asc(Expression<?> x)`: this method returns an `Order` instance which enforces an ascending order by the value of the expression provided as the parameter.
* `desc(Expression<?> x)`: this method returns an `Order` instance which enforces a descending order by the value of the expression provided as the parameter.

Let's modify the above example to add the descending order such that we have all the students in descending order of the number of addresses.

```java
    CriteriaBuilder builder = em.getCriteriaBuilder();
    CriteriaQuery<Student> cq = builder.createQuery(Student.class);
    Root<Address> root = cq.from(Address.class);
    Join<Address, Student> joinOnStudent = root.join("student");

    Expression<Long> count = builder.count(root.get("id"));
    cq
        .select(joinOnStudent)
            .groupBy(joinOnStudent.get("id"))
                .having(builder.ge(count, 3))
                        .orderBy(builder.desc(count));

    List<Student> resultList = em.createQuery(cq).getResultList();
```


The output query produced by the above criteria query is below:

```java
    select
        student1_.id as id1_4_,
        student1_.name as name2_4_,
        student1_.passport_id as passport3_4_ 
    from
        address address0_ 
    inner join
        student student1_ 
            on address0_.student_id=student1_.id 
    group by
        student1_.id 
    having
        count(address0_.id)>=3
    order by
        count(address0_.id) asc
```

{% include ads/article-ads.html %}
&nbsp;
### Subquery

A `subquery` is a nested query which is embedded in the `WHERE` clause of the main query. The results of the subquery are consumed by the main query.

`subquery` method is part of [CommonAbstractCriteria](https://docs.oracle.com/javaee/7/api/javax/persistence/criteria/CommonAbstractCriteria.html) interface. This interface provides functionality which is common to both top-level criteria queries as well as subqueries.

Let's change the above example to include a subquery.

```java
    CriteriaBuilder builder = em.getCriteriaBuilder();
    CriteriaQuery<Student> cq = builder.createQuery(Student.class);
    Root<Student> root = cq.from(Student.class);
    cq.select(root);
        /** Subquery is created from the main criteria query **/
        Subquery<Long> subquery = cq.subquery(Long.class);
        Root<Address> subRoot = subquery.from(Address.class);
        Join<Address, Student> joinOnStudent = subRoot.join("student");
        Path<Long> idPath = joinOnStudent.get("id");
        Expression<Long> idCountExp = builder.count(subRoot.get("id"));
        subquery
            .select(idPath)
                .groupBy(idPath)
                    .having(builder.ge(idCountExp, 3));

    /** subquery is provided as a parameter to the where method **/
    cq.where(root.get("id").in(subquery));

    List<Student> resultList = em.createQuery(cq).getResultList();
```

Below is the output of the final query produced--

```java
    select
        student0_.id as id1_4_,
        student0_.name as name2_4_,
        student0_.passport_id as passport3_4_ 
    from
        student student0_ 
    where
        student0_.id in (
            select
                student2_.id 
            from
                address address1_ 
            inner join
                student student2_ 
                    on address1_.student_id=student2_.id 
            group by
                student2_.id 
            having
                count(address1_.id)>=3
        )
            
```


&nbsp;
### Aggregate Functions

Criteria API supports the aggregate functions such as `count`, `avg`, `max`, and `min` etc. All the aggregate functions are part of the  [CriteriaBuilder](https://docs.oracle.com/javaee/6/api/javax/persistence/criteria/CriteriaBuilder.html) Interface. 

We have already seen in our initial example, how to use aggregate functions such as `count`.

&nbsp;

_If you have come this far, you might also want to learn about --- [how to select values in criteria Queries](/posts/java/jpa/select-values-in-criteria-queries). This post explains various methods provided in Criteria API to select single or multiple values. It also explains  tuple criteria queries._


