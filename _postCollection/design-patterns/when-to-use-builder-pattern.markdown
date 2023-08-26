---
layout: seriesPost
bannercolor: "yellow darken-4"
title:  "Explore different use-cases for builder pattern in Java"
date:   2023-08-26 18:00:00 +0200
meta: "Explore Builder Pattern in depth with real-world use-cases. Simplify complex object creation, create fluent APIs, build immutable objects, and configure customizable objects efficiently for enhanced software design and development."
excerpt: "Explore Builder Pattern in depth with real-world use-cases. Simplify complex object creation, create fluent APIs, build immutable objects, and configure customizable objects efficiently for enhanced software design and development."
category: Design-pattern
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: irshsheik
image: /assets/images/bd-dp.jpg
categories:
  - Design-pattern
  - all
---

The Builder Pattern is a creational design pattern that's particularly useful in scenarios where you need to create complex objects with many optional components or configurations. It promotes the construction of objects step by step, making it easier to understand and maintain the code. Here are some common use cases for the Builder Pattern along with code examples:

**1. Creating Immutable Objects:**

- Use case: When you want to create objects whose state cannot be changed after creation.
- Example: Creating an immutable `Person` class.

```java
public final class Person {
    private final String firstName;
    private final String lastName;
    private final int age;

    private Person(Builder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.age = builder.age;
    }

    public static class Builder {
        private String firstName;
        private String lastName;
        private int age;

        public Builder(String firstName, String lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }

        public Builder age(int age) {
            this.age = age;
            return this;
        }

        public Person build() {
            return new Person(this);
        }
    }

    // Getters for fields (no setters)

    public static void main(String[] args) {
        Person person = new Person.Builder("John", "Doe")
            .age(30)
            .build();

        System.out.println("First Name: " + person.getFirstName());
        System.out.println("Last Name: " + person.getLastName());
        System.out.println("Age: " + person.getAge());

        person.setLastName("John") //error - it does not have any public setters
        var person = new Person() // error - it does not have a public constructor
    }
}
```

**2. Building Configurable Objects:**

- Use case: When you need to create objects with many configuration options.
- Example: Creating a `Configuration` class.

```java
public class Configuration {
    private final String databaseUrl;
    private final String username;
    private final String password;
    private final boolean enableCaching;

    private Configuration(Builder builder) {
        this.databaseUrl = builder.databaseUrl;
        this.username = builder.username;
        this.password = builder.password;
        this.enableCaching = builder.enableCaching;
    }

    public static class Builder {
        private String databaseUrl;
        private String username;
        private String password;
        private boolean enableCaching;

        public Builder(String databaseUrl, String username, String password) {
            this.databaseUrl = databaseUrl;
            this.username = username;
            this.password = password;
        }

        public Builder enableCaching(boolean enableCaching) {
            this.enableCaching = enableCaching;
            return this;
        }

        public Configuration build() {
            return new Configuration(this);
        }
    }

    // Getters for fields (no setters)

    public static void main(String[] args) {
        Configuration configWithCaching = new Configuration
            .Builder("jdbc:mysql://localhost:3306/mydb", "user", "password")
            .enableCaching(true)
            .build();

		Configuration configWithNoCaching = new Configuration
            .Builder("jdbc:mysql://localhost:3306/mydb", "user", "password")
            .enableCaching(false)
            .build();

    }
}
```

**3. Fluent API for Object Construction:**

- Use case: When you want to provide a clean and readable API for object construction.
- Example: Using a `StringBuilder` to construct strings.

```java
StringBuilder builder = new StringBuilder();
builder.append("Hello")
       .append(" ")
       .append("World")
       .append("!");

String message = builder.toString();

```

**4. Complex Object Construction:**

- Use case: When you need to create objects with many interrelated parts.
- Example: Creating a complex `Report` object.

```java
import java.util.ArrayList;
import java.util.List;

// The complex object - Report
public class Report {
    private String title;
    private String author;
    private List<String> sections;

    private Report(Builder builder) {
        this.title = builder.title;
        this.author = builder.author;
        this.sections = new ArrayList<>(builder.sections);
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public List<String> getSections() {
        return new ArrayList<>(sections);
    }

    @Override
    public String toString() {
        return "Report{" +
                "title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", sections=" + sections +
                '}';
    }

    // Nested Builder class
    public static class Builder {
        private String title;
        private String author;
        private List<String> sections = new ArrayList<>();

        public Builder(String title, String author) {
            this.title = title;
            this.author = author;
        }

        public Builder addSection(String section) {
            sections.add(section);
            return this;
        }

        public Report build() {
            return new Report(this);
        }
    }

    public static void main(String[] args) {
        Report report = new Report.Builder("Monthly Sales Report", "John Doe")
            .addSection("Sales Overview")
            .addSection("Product Performance")
            .addSection("Financial Summary")
            .build();

        System.out.println("Report Details:");
        System.out.println("Title: " + report.getTitle());
        System.out.println("Author: " + report.getAuthor());
        System.out.println("Sections: " + report.getSections());
    }
}
```
