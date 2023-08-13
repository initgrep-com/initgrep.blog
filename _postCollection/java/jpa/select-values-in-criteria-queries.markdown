---
layout: post
bannercolor: "red dark-4"
title:  "Select values in criteria query - select, multiselect, tuple query"
date:   2019-02-17
meta: "JPA specification provides different ways to select values in criteria query. select, multiselect and tuple queries are used to select single or multiple values from one or more entities"
excerpt: "JPA specification provides different ways to select values in criteria query. select, multiselect and tuple queries are used to select single or multiple values from one or more entities"
category: jpa
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: irshsheik
image: cq1.jpg
categories:
    - jpa
    - java
    - all

---

Criteria API is one of the many features provided by JPA to create a programmatic Object graph model for queries. I have written a detailed post about building criteria Queries, Criteria Query Join between entities and using aggregate methods. You can check out the tutorial about [writing criteria queries in JPA](/posts/java/jpa/create-programmatic-queries-using-criteria-api).

To get started, let's analyze the `selection` of a basic  SQL `SELECT` query.

```java
    
    1: select * from STUDENT;

    2: select ID, NAME from STUDENT;

    3: select count(ID) from STUDENT;

    4:    SELECT s.NAME, a.CITY, a.ZIP_CODE
        FROM STUDENT s
        INNER JOIN ADDRESS a
        ON s.ID = a.STUDENT_ID;
```

1. Query (1) uses the `*` wild card to select all the column values from the table. 
2. Query (2) uses a more specific selection by selecting only the ID and NAME column values from the table. 
3. Query (3) uses an aggregate function `count` in the selection.
4. Query (4) selects the columns of different tables by joining the two tables.

The purpose of showing the above example is to have a rough idea of how the selection works in the `SQL` queries. Criteria Queries in JPA include various methods to select **single entity**, **single value**, **multiple values from same entity or different entities** and **aggregate functions**.

&nbsp;

JPA Criteria API provides the following options for the selection of values.

1. **CriteriaQuery.select** method.
2. **CriteriaQuery.multiselect** method.
3. creating a **CriteriaQuery** which returns a **tuple**.


&nbsp;

We will discuss the implementation of each method. The domain model will remain same as in the previous post.

{% include ads/article-ads.html %}

### CriteriaQuery.select
 This method takes one [Selection](https://docs.oracle.com/javaee/6/api/javax/persistence/criteria/Selection.html) item as a parameter. The parameter specifies the result returned by the Criteria Query. The `select` method can be used to select a **single entity** or a **single value**.
 
 Let's select a student on the basis of its identifier (`ID column`). 
 
 ```java
    /** create  a Criteria Builder **/
    CriteriaBuilder builder = em.getCriteriaBuilder();
    /** create a CriteriaQuery which returns student Objects **/
    CriteriaQuery<Student> cq = builder.createQuery(Student.class);
    /** fetch the Student Entity **/
    Root<Student> student = cq.from(Student.class);
    /** select the Student entity**/
    cq.select(student);
    /** add a restriction to fetch only student with ID= 1003 **/
    cq.where(builder.equal(student.get("id"), 10003L));
    /** fetch the student result **/
    Student studentResult = em.createQuery(cq).getSingleResult();

 ```
 
The above example fetches a student Entity. 

* We build a Criteria query by calling `CriteriaBuilder.createQuery` method.
* The `Root` instance returned from the `CriteriaQuery.from` method references the type of the entity provided in the parameter. In this case, it is the `Student` entity.
* The `select` method takes the root as the parameter

&nbsp;

In order to return a __single value__ from the criteria query for each row, we have to provide a `Path` instance which refers to the attribute to be selected.

```java
    Path<String> namePath = student.get("name");
    cq.select(namePath);
```

The `Select` method accepts the parameter of type `Selection`. The `Path` interface is a child interface of Selection which makes Path instance an ideal candidate for the parameter. 
> *In the previous post related to [writing criteria queries in JPA](/posts/java/jpa/create-programmatic-queries-using-criteria-api), I have explained the inheritance tree of various interfaces.*

&nbsp;
&nbsp;

**Aggregate Operation ---**
If an aggregate method is used in selection, the return type of the criteria query result would be the same as the return type of the aggregate method. For example, if we use `count`, the query type should be `Long`.

```java
    CriteriaQuery<Long> cq = builder.createQuery(Long.class);
    Root<Student> root = cq.from(Student.class);
    cq.select(builder.count(root));
    Long resultList = em.createQuery(cq).getSingleResult();
```

&nbsp;
&nbsp;

**Fetching Relationships ---**
In case of the relationships such as `OneToMany`, `OneToOne` or `ManyToMany`, the output query results in an implicit `join` operation.
I have updated the above query to fetch all the addresses of a given student. 
```java
    CriteriaQuery<Address> cq = builder.createQuery(Address.class);
    Root<Student> student = cq.from(Student.class);
    Path<Address> addressPath = student.get("addresses");
    cq.select(addressPath);
    cq.where(builder.equal(student.get("id"), 10003L));
    List<Address> resultList = em.createQuery(cq).getResultList();
```

Below is the output query for the reference.
```java
    select
        addresses1_.id as id1_0_,
        addresses1_.city_code as city_cod2_0_,
        addresses1_.city_lang as city_lan3_0_,
        addresses1_.city_name as city_nam4_0_,
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
    where
        student0_.id=10003

```

&nbsp;
&nbsp;

{% include ads/article-ads.html %}

Until now we implemented the criteria query to select an Entity or a single value. However, It is not ideal to fetch a complete entity if only a few values are required. Criteria API provides many ways to accomplish that. 

### CriteriaQuery.multiselect 
This method takes one or more [Selection](https://docs.oracle.com/javaee/6/api/javax/persistence/criteria/Selection.html) items as parameters. The parameters specify the result returned by the Criteria Query. 
The `multiselect` method can be used to select a single entity, single or multiple values of the same entity or of different entities.

There are a few things to be noted before we move on to the examples.
* If the criteria query is of the array type i.e `CriteriaQuery<T[]>` where `T` represents a data type. The elements of the array will correspond to the arguments of the `multiselect` method in the specified order for each row.

* If the criteria query is of the Type `CriteriaQuery<T>` where `T` is a user-defined class. The arguments to the `multiselect`  method will be passed to one of the constructors of the class T and an object of the type T will be returned for each row. _In case the matching constructor is not found, an exception will be thrown_.

* If an only single argument is provided to `multiselect` method and no type is mentioned, the instance of the type `Object` is returned. 
In case of more than one arguments, an instance of type `Object[]` will be instantiated and returned for each row. The elements of the array will correspond to the arguments to the `multiselect` method, in the specified order.

Let's see some examples ---

```java
    CriteriaBuilder builder = em.getCriteriaBuilder();
    CriteriaQuery<Student> cq = builder.createQuery(Student.class);
    Root<Student> root = cq.from(Student.class);
    cq.multiselect(root.get("id"),root.get("name"));
    List<Student> resultList = em.createQuery(cq).getResultList();
```
In the above example, The arguments to `multiselect` method expect a constructor from the `Student` class. It should have the similar signature as the order of the arguments such as
```java
 public Student(Long id, String name) {
        this.id = id;
        this.name = name;
    }
```

If the constructor is not present, It will throw an exception.

It might not always be possible to go ahead and add a new constructor in an existing class. To avoid that, we can create the criteria query of the __Array type__.

```java
    CriteriaBuilder builder = em.getCriteriaBuilder();
    CriteriaQuery<Object[]> cq = builder.createQuery(Object[].class);
    Root<Student> root = cq.from(Student.class);
    cq.multiselect(root.get("id"),root.get("name"));
    List<Object[]> resultList = em.createQuery(cq).getResultList();
```
As explained earlier, each argument would take a specific position in the array, based on the order. In this case, `ID` would be the first item in array and `name` would be second. let's print the values returned for each row. 

```java
    resultList.forEach(s -> log.info(" result row = {} - {}", s[0],s[1] ));
```

&nbsp;
&nbsp;

{% include ads/article-ads.html %}

### Tuple Criteria Queries

The [Tuple](https://docs.oracle.com/javaee/7/api/javax/persistence/Tuple.html) is an interface which represents the key-value pairs of data for each row. The Tuple acts as a container for the data. A typical `Tuple` implementation contains 
* an array of Objects i.e `Object[]` 
*  Various `get` methods to fetch the values based __Index__ or __Alias__ of the arguments. 

Similar to other data types, criteria query can return a list of Tuple objects or a single Tuple object.

The following example shows how to fetch more than one value using a tuple criteria query.

```java
    /** create a tuple Query **/
    CriteriaQuery<Tuple> cq = builder.createTupleQuery();
    Root<Student> root = cq.from(Student.class);
    /** the name of the path also acts as an alias **/
    Path<String> namePath = root.get("name");
    Path<Long> idPath = root.get("id");
    cq.multiselect(idPath , namePath);
    /** Query returns list of Tuple objects **/
    List<Tuple> resultList = em.createQuery(cq).getResultList();
```

The `createTupleQuery` method returns a criteria query of the type `Tuple`. The result contains either a Tuple object or List of the Objects.  We can fetch the values using either index or the alias.
```java
/** fetch the values from result based on index **/
resultList.forEach(row -> 
                log.info("sdk {} -> {}", row.get(0), row.get(1) ));
/** fetch the values from result based on the alias **/
resultList.forEach(row ->
                 log.info("sdk {} -> {}", row.get(idPath), row.get(namePath) ));
```
