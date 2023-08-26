---
layout: seriesPost
bannercolor: "yellow darken-4"
title:  "Creational Design Patterns in Java With Examples "
date:   2023-08-26 19:00:00 +0200
meta: "Explore Creational Design Patterns in Java to master object creation techniques. Learn how Singleton, Factory Method, Abstract Factory, Builder, Prototype object creation in your Java applications."
excerpt: "Explore Creational Design Patterns in Java to master object creation techniques. Learn how Singleton, Factory Method, Abstract Factory, Builder, Prototype object creation in your Java applications."
category: Design-pattern
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: irshsheik
image: /assets/images/cr-dp.jpg
categories:
  - Design-pattern
  - all
---

Creational design patterns provide various ways to create objects while hiding the creation logic, making the system more independent of how its objects are created, composed, and represented. These patterns deal with object creation mechanisms, trying to create objects in a manner suitable to the situation.

 These are the key creational design patterns:

- **Singleton Pattern:** Ensures that a class has only one instance and provides a global point of access to that instance.
- **Factory Method Pattern:** This pattern defines an interface for creating an object but allows subclasses to alter the type of objects that will be created.
- **Abstract Factory Pattern:** Provides an interface for creating families of related or dependent objects without specifying their concrete classes.
- **Builder Pattern:** Separates the construction of a complex object from its representation, allowing the same construction process to create different representations.
- **Prototype Pattern:** Creates new objects by copying an existing object, known as the prototype.

Let’s explore each of them in detail.

### 1. Singleton Pattern

The Singleton pattern ensures that a class has only one instance and provides a global point of access to that instance. It's useful when one object controls access to a resource, such as a configuration manager or a database connection pool.

The Singleton pattern is designed to guarantee a single instance of a class, and it typically involves three key components:

1. **Private Constructor**: To prevent external instantiation of the class.
2. **Private Static Instance**: To hold the single instance of the class.
3. **Public Static Method**: To provide global access to the instance.

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() { }

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}

```

You should also read about  [Different ways to implement Thread-safe singleton pattern in Java](/posts/design-patterns/thread-safety-in-java-singleton-pattern)  

### 2. Factory Method Pattern

The Factory Method pattern defines an interface for creating an object but lets subclasses alter the type of objects that will be created. It's handy when you want to provide a generic interface for creating objects while allowing subclasses to provide concrete implementations.

```java
interface Product {
    void create();
}

class ConcreteProductA implements Product {
    @Override
    public void create() {
        System.out.println("Product A created.");
    }
}

class ConcreteProductB implements Product {
    @Override
    public void create() {
        System.out.println("Product B created.");
    }
}

abstract class Creator {
    public abstract Product factoryMethod();
}

class ConcreteCreatorA extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProductA();
    }
}

class ConcreteCreatorB extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProductB();
    }
}

```

Don’t confuse it with Static Factory Methods. Here is the a comparison between [Factory Method Pattern vs Static Factory Method](/posts/design-patterns/factory-method-pattern-vs-static-factory) 

### 3. Abstract Factory Pattern

The Abstract Factory pattern provides an interface to create families of related or dependent objects without specifying their concrete classes. It's useful when your system needs to be independent of how its objects are created, composed, and represented.

```java
interface AbstractFactory {
    ProductA createProductA();
    ProductB createProductB();
}

class ConcreteFactory1 implements AbstractFactory {
    @Override
    public ProductA createProductA() {
        return new ConcreteProductA1();
    }

    @Override
    public ProductB createProductB() {
        return new ConcreteProductB1();
    }
}

class ConcreteFactory2 implements AbstractFactory {
    @Override
    public ProductA createProductA() {
        return new ConcreteProductA2();
    }

    @Override
    public ProductB createProductB() {
        return new ConcreteProductB2();
    }
}

interface ProductA {
  
}

interface ProductB {
    
}

```

### 4. Builder Pattern

The Builder pattern separates the construction of a complex object from its representation, allowing the same construction process to create various representations. It's useful when you want to create complex objects with many optional components.

```java
class Product {
    private String part1;
    private String part2;

    public void setPart1(String part1) {
        this.part1 = part1;
    }

    public void setPart2(String part2) {
        this.part2 = part2;
    }

    @Override
    public String toString() {
        return "Product [part1=" + part1 + ", part2=" + part2 + "]";
    }
}

class ProductBuilder {
    private Product product = new Product();

    public void buildPart1(String part1) {
        product.setPart1(part1);
    }

    public void buildPart2(String part2) {
        product.setPart2(part2);
    }

    public Product getResult() {
        return product;
    }
}

public class BuilderPatternExample {
    public static void main(String[] args) {
        // Create a Product using the ProductBuilder
        Product product = new ProductBuilder()
            .buildPart1("Part 1")
            .buildPart2("Part 2")
            .getResult();
        
        // Display the created Product
        System.out.println("Product Details: " + product);
    }
}

```
Read more about [common use-cases for builder-pattern in java](/posts/design-patterns/when-to-use-builder-pattern)

### **5. Prototype Pattern**

The Prototype pattern allows you to create new objects by copying an existing object, known as the prototype. It's beneficial when creating an object is more expensive or complex than copying an existing one.

```java

class Prototype implements Cloneable {
    private String value;

    public Prototype(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public Prototype clone() throws CloneNotSupportedException {
        return (Prototype) super.clone();
    }
}

public class PrototypePatternExample {
    public static void main(String[] args) {
        // Creating a prototype
        Prototype original = new Prototype("Original Prototype");

        try {
            // Cloning the prototype to create new instances
            Prototype copy1 = original.clone();
            Prototype copy2 = original.clone();

            // Modifying the copied instances
            copy1.setValue("Copy 1");
            copy2.setValue("Copy 2");

            // Displaying values
            System.out.println("Original: " + original.getValue());
            System.out.println("Copy 1: " + copy1.getValue());
            System.out.println("Copy 2: " + copy2.getValue());
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }
}
```

## **Conclusion**

By using Design patterns like Singleton, Factory Method, Abstract Factory, Builder, and Prototype, you can improve the structure and maintainability of your Java code. Incorporating these patterns will not only make your codebase more robust but also enhance its readability and scalability.
