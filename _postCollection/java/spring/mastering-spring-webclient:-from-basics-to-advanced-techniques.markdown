---
layout: post
bannercolor: light-green accent-3
title: Mastering Spring WebClient - From Basics to Advanced Techniques
date: 2024-02-04
meta:  Understand what Spring WebClient is, how to set it up in a Spring Boot application, perform GET and POST requests, handle error handling, retry and backoff on specific exceptions.
excerpt: Understand what Spring WebClient is, how to set it up in a Spring Boot application, perform GET and POST requests, handle error handling, retry and backoff on specific exceptions.
category: spring
comments: true
author: code whiz
twitter: 
facebook: 
github: 
image: /assets/images/rollback.jpeg
categories:
    - spring
    - java
    - spring
    - all
---
 &nbsp;


Spring WebClient is a non-blocking, reactive HTTP client built on top of Project Reactor, which is the foundation for building reactive applications in Spring. In this post, we will see how to set up Spring WebClient, do a GET and POST request, handle errors. We will also see how to do retry and backoff using spring WebClient.

## What is Spring WebClient?

Spring WebClient provides a modern alternative to the RestTemplate for making HTTP requests in a non-blocking, reactive manner. It allows you to interact with RESTful services and consume HTTP resources in a declarative way.
Spring WebClient is a reactive web client introduced in Spring 5. It serves as the main entry point for performing web requests. Here are some key points:

- **Reactive and Non-blocking**: WebClient is designed for reactive programming, making it suitable for applications running on a Servlet Stack or a Reactive Stack.
HTTP/1.1 Protocol: It works over the HTTP/1.1 protocol.

- **Synchronous and Asynchronous**: It supports both synchronous and asynchronous operations.
- **Default Implementation**: The default implementation is the `DefaultWebClient` class.

## Setting Up Spring WebClient in a Spring Boot Application

**Dependencies**

Add the following dependency to your project:

```xml

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

**Setup**

```java
@Bean
public WebClient.Builder myWebClientBuilder() {
    return WebClient.builder()
        .baseUrl("https://api.example.com")
        .defaultHeader("Authorization", "Bearer myAccessToken");
        .defaultCookie("cookieKey", "cookieValue")
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .defaultUriVariables(Collections.singletonMap("url", "http://localhost:8080"))
        .build();

```


## Performing GET and POST Requests

Once the WebClient is set up, you can perform GET and POST requests to interact with RESTful services. Let's consider a use case of an ecommerce order transaction. We can use WebClient to fetch order details via a GET request and create a new order via a POST request.
```java
// performing a GET request
Mono<Order> getOrderDetails(String orderId) {
    return webClient.get()
        .uri("/orders/{orderId}", orderId)
        .retrieve()
        .bodyToMono(Order.class);
}

```
what is happening here -

- We create a `Mono` (a reactive wrapper) that represents the order details.
- Using WebClient, we perform an HTTP GET request to retrieve information about an order.
- The `{orderId}` placeholder in the URI is dynamically replaced with the actual order ID.
- We retrieve the response body and convert it to a `Mono<Order>`.

```java
// performing a POST request
Mono<Order> createOrder(Order order) {
    return webClient.post()
        .uri("/orders")
        .body(BodyInserters.fromValue(order))
        .retrieve()
        .bodyToMono(Order.class);
}
```
Here is the breakdown -

- We create a `Mono<Order>` representing the newly created order.
- Using WebClient, we perform an HTTP POST request to create a new order.
- We specify the URI as `/orders` to target the order creation endpoint.
- The order object is serialized and sent as the request body.
- We retrieve the response body (which contains the created order) and convert it to a `Mono<Order>`.

## Handling Error Handling

Error handling is crucial when interacting with external services. Spring WebClient provides mechanisms to handle errors gracefully. You can use the `onErrorResume` and `onErrorMap` operators to handle specific errors and transform them into meaningful responses.

### Provide alternative result using onErrorResume

```java
// Sample code for handling errors with WebClient
Mono<Order> getOrderDetails(String orderId) {
    return webClient.get()
        .uri("/orders/{orderId}", orderId)
        .retrieve()
        .onStatus(HttpStatus::is4xxClientError,
            clientResponse -> Mono.error(new OrderNotFoundException()))
        .bodyToMono(Order.class)
        .onErrorResume(OrderNotFoundException.class, e -> Mono.empty());
}
```
In the above example, we used `onErrorResume`. It is a method provided by Project Reactor (which Spring WebClient uses) to handle errors in reactive streams. It allows you to return a fallback value (either a Mono or a Flux) when an error occurs during stream processing. The fallback value is used to continue the stream execution, effectively replacing the erroneous element.  You can use `onErrorResume` when you want to gracefully handle errors by providing an alternative result.

### Provide meaningful Exception using onErrorMap

If you do not want to return an alternative result. Rather, you would want to translate the error into a meaningful Domain related exception. you can use `onErrorMap`. It allows you to transform one error into another by applying a mapping function. Unlike `onErrorResume`, it doesn’t provide a fallback value; instead, it replaces the original error with a new one.

```java
// Sample code for handling errors with WebClient
Mono<Order> getOrderDetails(String orderId) {
    return webClient.get()
        .uri("/orders/{orderId}", orderId)
        .retrieve()
        .bodyToMono(Order.class)
        .onErrorMap(WebClientResponseException.class, ex -> {
            if (ex.getRawStatusCode() == 404) {
                return new OrderNotFoundException("Order not found for ID: " + orderId);
            }
            return ex; // Re-throw other exceptions
        });
}

```


### Transform the status code into meaningful exception using onStatus
We can also use `onStatus` operator to transform a status code to a meaninful exception. In the below example we transform **4XX** codes into OrderNotFoundException. 

```java
Mono<Order> getOrderDetails(String orderId) {
    return webClient.get()
        .uri("/orders/{orderId}", orderId)
        .retrieve()
        .onStatus(HttpStatus::is4xxClientError,
            clientResponse -> Mono.error(new OrderNotFoundException()))
        .bodyToMono(Order.class)
        .onErrorMap(OrderNotFoundException.class,
            e -> new CustomOrderException("Failed to retrieve order details"));
}
```

## Retrying and Backoff on Specific Exceptions

Often, network or service failures can occur. Spring WebClient provides operators such as `retry` and `backoff` to handle these scenarios gracefully. You can specify the conditions under which a retry should occur and define backoff strategies to wait before retrying.


```java
// Sample code for retrying and backoff on specific exceptions in WebClient
webClient.get()
    .uri("/orders")
    .retrieve()
    .onStatus(HttpStatus::INTERNAL_SERVER_ERROR,
            clientResponse -> Mono.error(new OrderServiceUnavailableException()))
    .bodyToMono(Order.class)
    .retryWhen(Retry.backoff(3, Duration.ofSeconds(5))
        .filter(throwable -> throwable instanceof OrderServiceUnavailableException));
```
In the above example, we perform a GET request to `/orders`. We also handle internal server errors by throwing a custom exception `OrderServiceUnavailableException`. It retries the operation up to 3 times with an exponential backoff strategy. If the exception thrown during the retry is an `OrderServiceUnavailableException`, the retry is allowed. This is a way to handle transient errors or temporary unavailability of the service.
