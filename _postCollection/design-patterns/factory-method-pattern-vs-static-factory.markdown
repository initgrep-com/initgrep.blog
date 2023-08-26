---
layout: seriesPost
bannercolor: "yellow darken-4"
title:  "Factory Method Pattern vs Static Factory Method"
date:   2023-08-26 16:00:00 +0200
meta: "Factory Method Pattern vs Static Factory Method: Comparison of software design patterns for object creation, highlighting flexibility and simplicity."
excerpt: "Factory Method Pattern vs Static Factory Method: Comparison of software design patterns for object creation, highlighting flexibility and simplicity."
category: Design-pattern
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: irshsheik
image: /assets/images/fac-dp.jpg
categories:
  - Design-pattern
  - all
---

The Factory Method Pattern and the Static Factory (Static Factory Method) are two different approaches to achieving object creation. Let's explore the differences between them:

## Factory Method Pattern

**1. Instance Creation:** In the Factory Pattern, you typically create a separate factory class (or interface) responsible for creating instances of various classes. These factory classes can be subclasses of a common factory interface or part of an object hierarchy.

**2. Flexibility:** The Factory Pattern promotes flexibility by allowing you to change the concrete classes you instantiate without affecting the client code that uses the factory. This makes it easier to introduce new types of objects.

**3. Extensibility:** You can create multiple factory classes, each responsible for creating objects of a specific type. This makes it easy to extend the factory to handle new types of objects.

**4. Abstraction:** The Factory Pattern promotes abstraction by hiding the details of object creation. Clients interact with the factory, and they don't need to know the specifics of how objects are created.

**5. Inheritance:** The Factory Pattern often involves inheritance. You create concrete factory classes that inherit from a common factory interface or class and override methods to create specific objects.

Here's a simple example of the Factory Method Pattern in Java:

```java
interface Shape {
    void draw();
}

class Circle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a circle.");
    }
}

class Rectangle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a rectangle.");
    }
}

interface ShapeFactory {
    Shape createShape();
}

class CircleFactory implements ShapeFactory {
    @Override
    public Shape createShape() {
        return new Circle();
    }
}

class RectangleFactory implements ShapeFactory {
    @Override
    public Shape createShape() {
        return new Rectangle();
    }
}

```

## Static Factory (Static Factory Method)

**1. Instance Creation:** Static Factory Methods are methods within a class (usually the same class you want to instantiate) that create instances of that class.

**2. Flexibility:** Static Factory Methods can have more descriptive names, which can make the code more readable. They are not bound by the constraints of constructor names, and they can return different subclasses or cached instances as needed.

**3. Extensibility:** Static Factory Methods can be part of a class hierarchy and can be overridden by subclasses. This allows you to return instances of different subclasses without exposing the details to the client code.

**4. Abstraction:** Like the Factory Pattern, Static Factory Methods promote abstraction by hiding the constructor details from the client code.

Here's a simple example of Static Factory Methods in Java:

```java
class Shape {
    private String type;

    private Shape(String type) {
        this.type = type;
    }

    public static Shape createCircle() {
        return new Shape("Circle");
    }

    public static Shape createRectangle() {
        return new Shape("Rectangle");
    }

    public String getType() {
        return type;
    }
}

```

### Key Differences

1. **Class vs. Method:** The primary difference is where the creation logic resides. The Factory Pattern uses a separate class (or interface) for creating objects, while Static Factory Methods are defined within the same class.
2. **Inheritance:** The Factory Pattern is often more suitable for scenarios involving class hierarchies and polymorphism, as it allows different factory implementations. Static Factory Methods can also support inheritance but are more concise.
3. **Naming:** Static Factory Methods have the advantage of having descriptive names, making code more readable.
4. **Multiple Factories:** In the Factory Pattern, you can have multiple factory classes, each responsible for a specific type of object. In Static Factory Methods, you have a single class with multiple methods.

The choice between these two approaches depends on your specific use case and design goals. If you want more flexibility, abstraction, and multiple factory implementations, the Factory method Pattern is a good choice. If you prefer concise, self-contained creation methods with meaningful names, Static Factory Methods are a good fit. 

---