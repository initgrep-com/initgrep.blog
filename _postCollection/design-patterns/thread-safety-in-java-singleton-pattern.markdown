---
layout: seriesPost
bannercolor: "yellow darken-4"
title:  "Explore Different Ways to Implement Thread-Safe Singleton Pattern in Java"
date:   2023-08-26 17:00:00 +0200
meta: "Discover how to achieve thread safety in Java Singleton patterns. Explore methods like eager and lazy initialization, double-checked locking, Bill Pugh Singleton and enum Singletons for robust concurrency control."
excerpt: "Discover how to achieve thread safety in Java Singleton patterns. Explore methods like eager and lazy initialization, double-checked locking,  Bill Pugh Singleton and enum Singletons for robust concurrency control."
category: Design-pattern
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: irshsheik
image: /assets/images/sg-dp.jpg
categories:
  - Design-pattern
  - all
---


The Singleton design pattern is a well-known creational pattern that ensures a class has only one instance while providing a global point of access to that instance. However, ensuring thread safety in a Singleton is crucial, especially in multi-threaded environments. In this blog post, we will explore various techniques to implement a thread-safe Singleton pattern in Java, and we'll discuss the pros and cons of each approach.

## Understanding the Singleton Pattern

Before diving into different ways of achieving thread-safe Singletons, let's recap the basics of the Singleton pattern:

The Singleton pattern is designed to guarantee a single instance of a class, and it typically involves three key components:

1. **Private Constructor**: To prevent external instantiation of the class.
2. **Private Static Instance**: To hold the single instance of the class.
3. **Public Static Method**: To provide global access to the instance.

## Different Ways to Implement Thread-Safe Singleton Patterns

### 1. Eager Initialization

In the eager initialization approach, the Singleton instance is created at the time of class loading. This ensures thread safety but may not be memory-efficient if the Singleton is not used immediately.

```java
public class EagerInitializedSingleton {
    private static final EagerInitializedSingleton instance = new EagerInitializedSingleton();

    private EagerInitializedSingleton() { }

    public static EagerInitializedSingleton getInstance() {
        return instance;
    }
}

```

While this approach is Simple and thread-safe but it may create the instance even if it's not needed.

### 2. Lazy Initialization (Synchronized Method)

In this approach, the Singleton instance is created only when it's requested for the first time. It uses a synchronized method to ensure thread safety.

```java
public class LazyInitializedSingleton {
    private static LazyInitializedSingleton instance;

    private LazyInitializedSingleton() { }

    public static synchronized LazyInitializedSingleton getInstance() {
        if (instance == null) {
            instance = new LazyInitializedSingleton();
        }
        return instance;
    }
}

```

This approach uses Lazy initialization, and is thread-safe but the synchronization can introduce performance overhead.

### 3. Double-Checked Locking

This technique combines lazy initialization and double-checked locking to improve performance by avoiding synchronization once the instance is created.

```java
public class DoubleCheckedLockingSingleton {
    private static volatile DoubleCheckedLockingSingleton instance;

    private DoubleCheckedLockingSingleton() { }

    public static DoubleCheckedLockingSingleton getInstance() {
        if (instance == null) {
            synchronized (DoubleCheckedLockingSingleton.class) {
                if (instance == null) {
                    instance = new DoubleCheckedLockingSingleton();
                }
            }
        }
        return instance;
    }
}

```

This technique uses Lazy initialization and provides improved performance but it requires careful implementation to avoid subtle issues.

### 4. Bill Pugh Singleton

The Bill Pugh Singleton, also known as the Initialization-on-demand holder idiom, is a clever way to ensure thread safety in a Singleton without requiring explicit synchronization. It leverages the fact that static nested classes are not loaded until they are referenced, ensuring safe lazy initialization. Here's how it works:

1. **Inner Static Class**: In the Bill Pugh Singleton pattern, the Singleton instance is nested within a private static inner class. This inner class is not loaded until it is referenced.
2. **Lazy Initialization**: The Singleton instance is created when the inner class is first referenced. This ensures that the instance is only created when it is needed, which is a form of lazy initialization.
3. **Static Final Instance**: The Singleton instance is declared as a `static final` variable in the inner class. This guarantees that it is initialized only once, and subsequent access to it returns the same instance.

Here's a simplified example of the Bill Pugh Singleton pattern:

```java
public class BillPughSingleton {
    // Private constructor to prevent external instantiation
    private BillPughSingleton() {
        // Initialization code here
    }

    // Inner static class responsible for lazy initialization
    private static class SingletonHelper {
        // Static final instance of the Singleton
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }

    // Public method to access the Singleton instance
    public static BillPughSingleton getInstance() {
        return SingletonHelper.INSTANCE;
    }
}

```

Thread safety is guaranteed in this pattern because:

- The Singleton instance is only created when the `getInstance` method is called, ensuring lazy initialization.
- Static initialization guarantees that the instance is created only once, even in a multi-threaded environment.
- There is no need for explicit synchronization since the JVM handles the class loading and instance creation in a thread-safe manner.

The Bill Pugh Singleton pattern is a recommended way to create thread-safe singletons in Java, and it avoids synchronization overhead until the Singleton instance is actually needed.

### 5. Singleton Using Enum

Enums in Java are more than constants because they can encapsulate behavior, making them versatile. 

The Java enum type itself provides inherent thread-safety, as enum values are effectively singletons by design. They are initialized once, when the enum class is loaded, and they cannot be instantiated again.

Using an enum for Singleton patterns is not only concise but also more resistant to several Singleton-related issues, such as reflection-based attacks and serialization problems, which other Singleton implementations may require additional effort to address.

```java
import java.security.SecureRandom;

public enum OtpService {
    INSTANCE;

    // Inner OTPService class
    private static class OTPService {
        private final SecureRandom random = new SecureRandom();
        private final int otpLength = 6;

        public String generateOtp() {
            StringBuilder otp = new StringBuilder();
            for (int i = 0; i < otpLength; i++) {
                otp.append(random.nextInt(10)); // Generates a random digit (0-9)
            }
            return otp.toString();
        }

        public boolean verifyOtp(String providedOtp, String expectedOtp) {
            return providedOtp.equals(expectedOtp);
        }
    }

    private final OTPService otpService = new OTPService();

    // Delegate methods to the inner OTPService
    public String generateOtp() {
        return otpService.generateOtp();
    }

    public boolean verifyOtp(String providedOtp, String expectedOtp) {
        return otpService.verifyOtp(providedOtp, expectedOtp);
    }
}

public class Main {
    public static void main(String[] args) {
        // Get an instance of the OTP service
        OtpService otpService = OtpService.INSTANCE;

        // Generate an OTP
        String otp = otpService.generateOtp();
        System.out.println("Generated OTP: " + otp);

        // Simulate OTP verification
        String userEnteredOtp = "123456"; // Replace with user input
        boolean isOtpValid = otpService.verifyOtp(userEnteredOtp, otp);

        if (isOtpValid) {
            System.out.println("OTP is valid.");
        } else {
            System.out.println("OTP is invalid.");
        }
    }
}
```

- We create an inner class called **`OTPService`** within the **`OtpService`** enum. This inner class encapsulates the OTP generation and verification logic.
- The **`otpService`** field within the enum is an instance of **`OTPService`**, and it is used to delegate OTP-related operations to the inner class.
- The **`generateOtp`** and **`verifyOtp`** methods within the enum delegate their operations to the corresponding methods in the **`OTPService`** inner class.

## **Conclusion**

Each of the methods discussed has its own merits and use cases. The choice of which approach to use depends on your specific requirements and the trade-offs you are willing to make between eager or lazy initialization, synchronization overhead, and code complexity.