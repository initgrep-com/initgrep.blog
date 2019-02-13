---
layout: post
bannercolor: "lime accent-4"
title:  "select values in JPA Criteria Query API(select , multiselect)"
date:   2019-02-11
meta: "djksjkdjksjdkjd"
excerpt: "djksjkdjksjdkjd"
category: jpa
comments: false
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: igagrock
image: cq1.jpg

---

Criteria API is one of the many features provided by JPA to create a programmatic Object graph model for queries. I have wrote a detailed post about building criteria Queries, specifying Criteria Joins between entities and using aggregate functions. You can check out the tutorial about [writing criteria queries in JPA](/posts/java/jpa/create-programmatic-queries-using-criteria-api).

To get started, let's analyse the `selection` of a basic  SQL `SELECT` query.

```java
	
    1: select * from STUDENT;

    2: select ID,NAME from STUDENT;

    3: select count(ID) from STUDENT;

    4:	SELECT s.NAME, a.CITY, a.ZIP_CODE
        FROM STUDENT s
        INNER JOIN ADDRESS a
        ON s.ID = a.STUDENT_ID;
```

1.  Query (1) uses the `*` wild card to select all the column values from the table. 
2. Query (2) uses a more specific selection by selecting only the ID and NAME column values from the table. 
3. Query (3) uses an aggregate function `count` in the selection.
4. Query (4) selects the columns of different tables by joining the two tables.

The purpose of showing the above example is to have a rough idea of how the selection works in the SQL queries. Criteria Queries in JPA include various methods to select **single entity**, **single value**, **multiple values from same entity or different entities** and **aggregate functions**.

JPA Criteria API provides following options for the selection of values.
* **CriteriaQuery.select** --- This method take one [Selection](https://docs.oracle.com/javaee/6/api/javax/persistence/criteria/Selection.html) item as parameter. The parameter specify the result returned by the Criteria Query. `select` method can be used to select a **single entity** or a **single value**.

*  **CriteriaQuery.multiselect** --- This method take one or more [Selection](https://docs.oracle.com/javaee/6/api/javax/persistence/criteria/Selection.html) items as parameters. The parameters specify the result returned by the Criteria Query. `multiselect` method can be used to select a single entity, single or multiple values of same entity or of different entities.

### CriteriaQuery select
### CriteriaQuery multiSelect