---
layout: seriesPost
bannercolor: "yellow darken-4"
title:  "Structural Design Patterns in Java With Examples "
date:   2023-09-13 19:00:00 +0200
meta: "Explore the Power of Structural Design Patterns in Java with Real-World Examples - Uncover how Java's structural design patterns enhance code flexibility and maintainability."
excerpt: "Explore the Power of Structural Design Patterns in Java with Real-World Examples - Uncover how Java's structural design patterns enhance code flexibility and maintainability."
category: Design-pattern
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: irshsheik
image: /assets/images/str-dp.jpg
categories:
  - Design-pattern
  - all
---


Structural Design Patterns deal with the composition of classes or objects to form larger structures. They help in organising different parts of a system, ensuring that they work together seamlessly. These patterns make it easier to modify and extend the structure of an application without altering its individual components.

### Types of Structural Design Patterns

**Here are the different types:**

- **Adapter Pattern**
- **Bridge Pattern**
- **Decorator Pattern**
- **Composite Pattern**
- **Proxy Pattern**
- **Flyweight Pattern**
- **Facade Pattern**

### 1. Adapter Pattern

The Adapter Pattern allows objects with incompatible interfaces to work together. It acts as a bridge between the two incompatible interfaces, making them compatible without changing their source code.

**Example -**

Suppose you're working on a project that needs to integrate with two different payment gateways: `PaymentGatewayA` and `PaymentGatewayB`. Unfortunately, they have different interfaces, and your project is designed to work with a unified payment interface.

You can use the Adapter Pattern to create adapters for each payment gateway, making them compatible with your unified payment interface.

```java
// Unified Payment Interface
interface PaymentProcessor {
    void processPayment(double amount);
}

// Payment Gateway A
class PaymentGatewayA {
    void executePaymentA(double amount) {
        // Payment logic for Gateway A
    }
}

// Adapter for Payment Gateway A
class PaymentGatewayAAdapter implements PaymentProcessor {
    private PaymentGatewayA gatewayA;

    PaymentGatewayAAdapter(PaymentGatewayA gatewayA) {
        this.gatewayA = gatewayA;
    }

    @Override
    public void processPayment(double amount) {
        gatewayA.executePaymentA(amount);
    }
}

// Payment Gateway B
class PaymentGatewayB {
    void performTransactionB(double amount) {
        // Payment logic for Gateway B
    }
}

// Adapter for Payment Gateway B
class PaymentGatewayBAdapter implements PaymentProcessor {
    private PaymentGatewayB gatewayB;

    PaymentGatewayBAdapter(PaymentGatewayB gatewayB) {
        this.gatewayB = gatewayB;
    }

    @Override
    public void processPayment(double amount) {
        gatewayB.performTransactionB(amount);
    }
}
```

In this example, the Adapter Pattern allows you to create adapters for Payment Gateway A and B, enabling them to work with the unified `PaymentProcessor` interface used in your project.

Let’s take another example. Suppose You're working with a legacy library that provides data in an incompatible format, but you need to integrate it into your modern system.

You can use the Adapter Pattern to make the legacy library compatible with your system.

```java
// Legacy CSV Data Source
class LegacyCsvDataSource {
    String readCsvData() {
        // Read and return CSV data
    }
}

// Modern JSON Data Source
interface JsonDataSource {
    String readJsonData();
}

// Adapter
class CsvToJsonAdapter implements JsonDataSource {
    private LegacyCsvDataSource csvDataSource;

    CsvToJsonAdapter(LegacyCsvDataSource csvDataSource) {
        this.csvDataSource = csvDataSource;
    }

    @Override
    public String readJsonData() {
        String csvData = csvDataSource.readCsvData();
        // Convert CSV to JSON and return
    }
}
```


### **2. Bridge Pattern**

The Bridge Pattern separates an object’s abstraction from its implementation so that the two can vary independently. It's useful when you want to avoid a permanent binding between an abstraction and its implementation.

Scenario: You are developing a drawing application where shapes can be drawn on various platforms, such as Windows and Linux. You want to ensure that the shape's drawing logic is independent of the platform it's running on.

Solution: Use the Bridge Pattern to separate the shape abstraction from its drawing implementation.

```java
// Abstraction - Shape
abstract class Shape {
    protected DrawingAPI drawingAPI;

    Shape(DrawingAPI drawingAPI) {
        this.drawingAPI = drawingAPI;
    }

    abstract void draw();
}

// Implementor - DrawingAPI
interface DrawingAPI {
    void drawCircle();
    void drawSquare();
}

// Concrete Implementor - WindowsDrawingAPI
class WindowsDrawingAPI implements DrawingAPI {
    @Override
    public void drawCircle() {
        // Windows-specific circle drawing logic
    }

    @Override
    public void drawSquare() {
        // Windows-specific square drawing logic
    }
}

// Concrete Implementor - LinuxDrawingAPI
class LinuxDrawingAPI implements DrawingAPI {
    @Override
    public void drawCircle() {
        // Linux-specific circle drawing logic
    }

    @Override
    public void drawSquare() {
        // Linux-specific square drawing logic
    }
}

// Refined Abstraction - Circle
class Circle extends Shape {
    Circle(DrawingAPI drawingAPI) {
        super(drawingAPI);
    }

    @Override
    void draw() {
        drawingAPI.drawCircle();
    }
}
```

The Bridge Pattern separates the abstraction (`Shape`) from the drawing implementation (`DrawingAPI`). Different platforms, such as Windows and Linux, can have their own implementations of `DrawingAPI`, and `Shape` can use these implementations without needing to change its code.

### 3. Decorator Pattern

The Decorator Pattern allows you to add new functionalities to an object dynamically without altering its structure. It's like adding layers of behavior to an object.

**Scenario:** You're building an e-commerce platform, and you want to provide users with the ability to customize the colors and sizes of products. You also want to calculate the total price of the customized product. we can Use the Decorator Pattern to dynamically add color and size options to a base product.

```java
// Component - Product
interface Product {
    String getDescription();
    double getPrice();
}

// Concrete Component - Base Product
class BaseProduct implements Product {
    private String name;
    private double basePrice;

    BaseProduct(String name, double basePrice) {
        this.name = name;
        this.basePrice = basePrice;
    }

    @Override
    public String getDescription() {
        return name;
    }

    @Override
    public double getPrice() {
        return basePrice;
    }
}

// Decorator - Product Customization
abstract class ProductCustomization implements Product {
    protected Product product;

    ProductCustomization(Product product) {
        this.product = product;
    }
}

// Concrete Decorator - Color Customization
class ColorCustomization extends ProductCustomization {
    private String color;
    private double colorPrice;

    ColorCustomization(Product product, String color, double colorPrice) {
        super(product);
        this.color = color;
        this.colorPrice = colorPrice;
    }

    @Override
    public String getDescription() {
        return product.getDescription() + " (" + color + ")";
    }

    @Override
    public double getPrice() {
        return product.getPrice() + colorPrice;
    }
}

// Concrete Decorator - Size Customization
class SizeCustomization extends ProductCustomization {
    private String size;
    private double sizePrice;

    SizeCustomization(Product product, String size, double sizePrice) {
        super(product);
        this.size = size;
        this.sizePrice = sizePrice;
    }

    @Override
    public String getDescription() {
        return product.getDescription() + " (" + size + ")";
    }

    @Override
    public double getPrice() {
        return product.getPrice() + sizePrice;
    }
}
```

Now, you can use this updated Decorator Pattern to create and customize products for your e-commerce site. For example:

```java
// Create a base product
Product baseProduct = new BaseProduct("T-Shirt", 20.0);

// Customize the product with color and size
Product customizedProduct = new SizeCustomization(new ColorCustomization(baseProduct, "Red", 5.0), "Large", 3.0);

// Display the customized product description and total price
System.out.println("Product: " + customizedProduct.getDescription());
System.out.println("Total Price: $" + customizedProduct.getPrice());
```

### 4. Composite Pattern

The Composite Pattern lets you compose objects into tree structures to represent part-whole hierarchies. It allows clients to treat individual objects and compositions of objects uniformly.

**Scenario**: In a banking system, customers may have various types of accounts, including savings accounts, checking accounts, and investment accounts. Each of these accounts can have sub-accounts, such as individual and joint accounts. You want to represent this hierarchy in a way that allows you to manage and display account information uniformly.

**Solution**: Use the Composite Pattern to represent accounts and sub-accounts within a customer's portfolio.

```java
import java.util.ArrayList;
import java.util.List;

// Component - Account
interface Account {
    String getAccountInfo();
}

// Leaf - Individual Account
class IndividualAccount implements Account {
    private String accountNumber;
    private double balance;

    IndividualAccount(String accountNumber, double balance) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    @Override
    public String getAccountInfo() {
        return "Individual Account #" + accountNumber + " - Balance: $" + balance;
    }
}

// Leaf - Joint Account
class JointAccount implements Account {
    private String accountNumber;
    private double balance;

    JointAccount(String accountNumber, double balance) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    @Override
    public String getAccountInfo() {
        return "Joint Account #" + accountNumber + " - Balance: $" + balance;
    }
}

// Composite - Portfolio
class Portfolio implements Account {
    private String portfolioName;
    private List<Account> accounts;

    Portfolio(String portfolioName) {
        this.portfolioName = portfolioName;
        accounts = new ArrayList<>();
    }

    void addAccount(Account account) {
        accounts.add(account);
    }

    @Override
    public String getAccountInfo() {
        StringBuilder info = new StringBuilder("Portfolio: " + portfolioName + "\n");
        for (Account account : accounts) {
            info.append(account.getAccountInfo()).append("\n");
        }
        return info.toString();
    }
}
```

With this Composite Pattern implementation, you can organize bank accounts and sub-accounts within a customer's portfolio. Here's an example of how you might use it:

```java
// Create individual accounts
Account individualAccount1 = new IndividualAccount("12345", 5000.0);
Account individualAccount2 = new IndividualAccount("67890", 7500.0);

// Create joint accounts
Account jointAccount1 = new JointAccount("J1", 12000.0);
Account jointAccount2 = new JointAccount("J2", 9000.0);

// Create a portfolio for a customer
Portfolio customerPortfolio = new Portfolio("Customer Portfolio");
customerPortfolio.addAccount(individualAccount1);
customerPortfolio.addAccount(individualAccount2);
customerPortfolio.addAccount(jointAccount1);
customerPortfolio.addAccount(jointAccount2);

// Display the customer's portfolio information
System.out.println(customerPortfolio.getAccountInfo());
```

### 5. Proxy Pattern

The Proxy Pattern is used to control access to an object. It acts as a placeholder for another object to control access to it or to add additional functionality.

**Use Cases**:

- Lazy loading: Creating an expensive object only when it's needed.
- Access control: Restricting access to certain operations or resources.
- Logging: Adding logging before and after method calls.
- Remote proxies: Representing objects in remote servers as local objects.

A common example is a virtual proxy for loading images on a web page. The proxy loads the real image only when it's requested by the user, saving bandwidth and resources.

```java
// Image interface
interface Image {
    void display();
}

// RealImage class representing the actual image
class RealImage implements Image {
    private String filename;

    RealImage(String filename) {
        this.filename = filename;
        loadFromDisk();
    }

    private void loadFromDisk() {
        System.out.println("Loading image: " + filename);
    }

    @Override
    public void display() {
        System.out.println("Displaying image: " + filename);
    }
}

// ImageProxy class acting as a virtual proxy
class ImageProxy implements Image {
    private RealImage realImage;
    private String filename;

    ImageProxy(String filename) {
        this.filename = filename;
    }

    @Override
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}

public class ProxyPatternExample {
    public static void main(String[] args) {
        // Create an image proxy (virtual proxy)
        Image image = new ImageProxy("large_image.jpg");

        // Image is not loaded until it's displayed
        System.out.println("Image proxy created.");

        // Display the image - the real image is loaded here
        image.display();

        // Displaying the image again - this time, it's already loaded
        image.display();
    }
}
```

### 6. Facade Pattern

The Facade Design Pattern is a structural pattern that provides a simplified interface to a complex subsystem. It acts as a "facade" or front door to a set of interfaces in a subsystem, making it easier to use and understand. By creating a unified interface, it shields clients from the complexities of the underlying system, promoting loose coupling and code maintainability.

**When to Use the Facade Pattern?**

Use the Facade Design Pattern when:

1. You want to provide a simple and unified interface to a complex system.
2. You need to decouple client code from the subsystem, reducing dependencies.
3. You want to improve code maintainability and readability.

Lets take an example of Multimedia player which can play videos and also provides controls to control the video.

```java
// Subsystem components
class AudioPlayer {
    void playAudio() { /* Logic to play audio */ }
}

class VideoPlayer {
    void playVideo() { /* Logic to play video */ }
}

class ScreenController {
    void displayOnScreen() { /* Logic to display on screen */ }
}

// Facade class
class MultimediaPlayerFacade {
    private AudioPlayer audioPlayer;
    private VideoPlayer videoPlayer;
    private ScreenController screenController;

    public MultimediaPlayerFacade() {
        this.audioPlayer = new AudioPlayer();
        this.videoPlayer = new VideoPlayer();
        this.screenController = new ScreenController();
    }

    public void playMovie() {
        audioPlayer.playAudio();
        videoPlayer.playVideo();
        screenController.displayOnScreen();
    }
}

// Client code
public class Main {
    public static void main(String[] args) {
        MultimediaPlayerFacade player = new MultimediaPlayerFacade();
        player.playMovie();
    }
}
```

SLF4J (Simple Logging Facade for Java), the logging framework provides a facade or simplified API for various underlying logging implementations, such as Logback, Log4j, and Java Util Logging (JUL). It uses the Facade Design Pattern to abstract away the differences between these logging systems and provides a unified logging API for developers.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyLoggerExample {
    // Get a logger instance using SLF4J
    private static final Logger logger = LoggerFactory.getLogger(MyLoggerExample.class);

    public static void main(String[] args) {
        logger.info("This is an info message.");
        logger.error("This is an error message.");
    }
}
```

The **`LoggerFactory`** facade provides a consistent way to obtain a logger, regardless of the underlying logging implementation. Developers can write log statements using the SLF4J **`Logger`** interface, and the actual logging behavior is determined by the logging framework configured in the project's dependencies

### 7. **Flyweight Pattern**

The Flyweight Pattern is a structural design pattern that aims to minimize the memory usage and improve the performance of an application by sharing as much as possible among similar objects. It is particularly useful when you have a large number of objects that have common state.

### Benefits of the Flyweight Pattern

1. **Memory Efficiency**: By sharing common state, the Flyweight Pattern reduces the memory footprint of your application, making it more efficient.
2. **Performance Improvement**: With fewer objects and reduced memory overhead, your application's performance can significantly improve.
3. **Simplified Code**: The pattern separates the intrinsic and extrinsic states of objects, leading to more organised and maintainable code.
4. **Reusable Components**: Flyweight objects can be reused across different contexts, reducing the need for creating new instances.

Imagine you are building a text editor application. Each character in a document can be represented as an object, but storing each character individually can quickly consume a lot of memory. Instead, we can use the Flyweight Pattern to share common character objects.

```java
import java.util.HashMap;
import java.util.Map;

class CharacterFactory {
    private Map<Character, Character> characterPool = new HashMap<>();

    public Character getCharacter(char c) {
        if (!characterPool.containsKey(c)) {
            characterPool.put(c, new Character(c));
        }
        return characterPool.get(c);
    }
}

class Character {
    private char symbol;

    public Character(char symbol) {
        this.symbol = symbol;
    }

    public void print() {
        System.out.print(symbol);
    }
}

public class TextEditor {
    public static void main(String[] args) {
        CharacterFactory factory = new CharacterFactory();

        String text = "Flyweight Pattern";
        for (char c : text.toCharArray()) {
            Character character = factory.getCharacter(c);
            character.print();
        }
    }
}
```

Another example use-case would be how the user session management is done. Managing user sessions efficiently is crucial for security and user experience. Here's an example of how you can use the Flyweight Pattern to manage user sessions:

```java
import java.util.HashMap;
import java.util.Map;

// Flyweight interface
interface UserSession {
    void displaySessionInfo();
}

// Concrete Flyweight: UserSessionFlyweight
class UserSessionFlyweight implements UserSession {
    private String username;
    private String sessionData; // Common session data shared among users

    public UserSessionFlyweight(String username, String sharedData) {
        this.username = username;
        this.sessionData = sharedData;
    }

    @Override
    public void displaySessionInfo() {
        System.out.println("User: " + username);
        System.out.println("Session Data: " + sessionData);
        System.out.println("---------------------------------------------------");
    }
}

// Flyweight Factory: UserSessionFactory
class UserSessionFactory {
    private Map<String, UserSession> userSessions = new HashMap<>();
    private String sharedSessionData = "Shared session data for all users"; // Common session data

    public UserSession getUserSession(String username) {
        if (!userSessions.containsKey(username)) {
            // Create and store a new user session if it doesn't exist
            UserSession session = new UserSessionFlyweight(username, sharedSessionData);
            userSessions.put(username, session);
        }
        return userSessions.get(username);
    }
}

// Client
public class BankingApp {
    public static void main(String[] args) {
        UserSessionFactory sessionFactory = new UserSessionFactory();

        // Simulate user sessions
        String[] users = {"User1", "User2", "User3", "User1"};

        for (String user : users) {
            UserSession session = sessionFactory.getUserSession(user);
            session.displaySessionInfo();
        }
    }
}
```
