---
layout: post
bannercolor: "blue dark-2"
title:  "Spring Security Architecture fundamentals"
date:   2021-08-17
meta: "Spring Security provides a ready to use framework for authentication as well as authorization. It provides AuthenticationProviders for Username and password and basic authentication, LDAP authentication, JWT authentication and provides apis for building custom AuthenticationProviders"
excerpt: "Spring Security provides a ready to use framework for authentication as well as authorization. It provides AuthenticationProviders for Username and password and basic authentication, LDAP authentication, JWT authentication and provides apis for building custom AuthenticationProviders"
category: spring
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: igagrock
image: ssf.jpeg
categories:
    - spring
    - java
    - all

---

Authentication and authorization are fundamental to the security of a web applications. While authentication *determines* if the user can be identified by the system, Authorization determines if the user has the access to the specific resource. 

Authentication as well as authorization design paradigm is continuously evolving. The main reason behind it is the continuous evolution in different methods of exploits used against the applications.

Spring security tries to solve this problem by packaging all the possible solutions together. 

> *The purpose of this article is to provide a high level understanding of spring security architecture for Servlet applications. It may not help you to immediately implement spring security in your application but it would definitely help you in the subsequent steps when you dive deeper.*


&nbsp;&nbsp;

## Filter pattern in spring security

Spring security for the web applications use the filter pattern to implement different type of security solution. At the very core of it are Servlet [filters](https://docs.oracle.com/javaee/7/api/javax/servlet/Filter.html). Spring framework provides `DelegatingFilterProxy` filter and Spring security adds `FilterChainProxy` filter on top of it. Both these filters are pivotal in Spring security.

![Spring Security filter architecture](/assets/images/spring-security-filter.svg)
*Spring Security Filter architecture*
{:.image-caption}

&nbsp;
### DelegatingFilterProxy Filter

Similar to the Servlet filters, the Spring security filters are implement`Filter` interface but they are also Spring beans which means they are managed by Spring `ApplicationContext`.

Since these filters are not registered via Servlet container standards(configured in web.xml), the servlet Container is not aware of them.

Spring provides `DelegatingFilterProxy` filter which sits in the filter chain. It bridges the **Servlet containers** lifecycle and Spring `ApplicationContext`.

When a request is delegated to `DelegatingFilterProxy`. It looks up bean filters from the application context and then invokes the relevant bean filter. `DelegatingFilterProxy` filter also allows for delayed bean Filter lookup.

&nbsp;
### FilterChainProxy Filter

Spring security provides a special bean filter named as `FilterChainProxy`. This filter is a single entry point which enables spring security for a web application.

It allows delegating request through a set of filters bundled as `SecurityFilterChain`. In order to determine which Spring Security Filter's should be invoked, `FilterChainProxy` uses `SecurityFilterChain`. There could be multiple `SecurityFilterChains` present.

`FilterChainProxy` is also used to perform some security specific task such as clearing `SecurityContext`. `FilterChainProxy` is more flexible than traditional Servlet Filters. It can determine which `securityFilterchain` to invoke by leveraging the `RequestMatcher` interface.

&nbsp;
### SecurityFilterChain

It is a list of security filters which are also Spring managed beans. These are registered with FilterChainProxy. The advantage of being registered with `SecurityFilterChain` are following:

`FilterChainProxy` leverages `RequestMatcher` interface to determine invocation based upon anything in `ServletRequest` including the URL.
Incase of multiple `SecurityFilterChains`, `FilterChainProxy` can determine which `SecurityFilterChain` should be used. It also clears `SecurityContext` to avoid any memory leaks.

&nbsp;
### Customizing the default SecurityFilterChain

Spring security creates an instance of `WebSecurity` via `WebSecurityConfiguration`. `WebSecurity` is responsible for creating an instance of `FilterChainProxy` filter. 

We can create customizations to the built-in functionality by —
- Either extending `WebSecurityConfigurerAdapter` and exposing it as a Configuration
- Or implementing `WebSecurityConfigurer` and exposing it as a Configuration.

*This configuration is imported when using `@EnableWebSecurity` annotation.*


&nbsp;
### AuthenticationEntryPoint

- When a client sends a request without authentication credentials, an implementation of `AuthenticationEntryPoint` will be used to send the response to the client to ask for credentials.

The `AuthenticationEntryPoint` implementation might perform a **redirect to a log in page**, respond with an **WWW-Authenticat**e header, etc.

&nbsp;
### AbstractAuthenticationProcessingFilter

This is the base filter used for authenticating the requests.
When the user request comes in
- If it has credentials pre-populated, the implementation of `AbstractAuthenticationProcessingFilter` is directly called.
- If the credentials are not populated, the implementation of `AuthenticationEntryPoint` is called first to request credentials from the client
    - After that `AbstractAuthenticationProcessingFilter` is directly called.

---
&nbsp;&nbsp;&nbsp;

# Authentication Architecture API
&nbsp;&nbsp;

### AuthenticationManager

This is a strategy interface which provides the API to perform authentication. It is invoked by spring security filters. The `authentication`  object that is returned is set on `SecurityContextHolder`.

It basically checks the authentication and decides

- If the principle is valid
- If the principle is invalid
- If the authentication is null

Incase, Security Filters are not used such as when using user-defined filters, `Authentication`  can be set on `SecurityContextHolder` manually.

&nbsp;
### ProviderManager

It is common implementation of `AuthenticationManager`. It delegates to a list of `AuthenticationProvider`s. Each `AuthenticationProvider` has the opportunity to authenticate as well as to show that it can not. 

It also allows an optional parent `AuthenticationManager`. If no `AuthenticationProvider` are provided, the parent `AuthenticationManager` is consulted for authentication.

If no `authenticationProviders` can authenticate, authentication fails.

&nbsp;
### AuthenticationProvider

Its implementations performs a specific type of authentication. For example, `DaoAuthenticationProvider` supports username/password based authentication while `JwtAuthenticationProvider` supports authenticating a JWT token.

&nbsp;
### SecurityContextHolder

This object contains the authentication information about a request.

It contains `SecurityContext` which by default is a `threadLocal` object. thus every request thread has its own `SecurityContext` object.

![SecurityContextHolder API Diagram](/assets/images/arc-sec.svg)
*SecurityContextHolder API Diagram*
{:.image-caption}


&nbsp;&nbsp;
### Security Context

The `securityContext` object contains `Authentication` Object. The `Authentication` object serves two main purposes within Spring Security —

- It acts as an input to `AuthenticationManager` to provide the credentials a user has provided to authenticate.

    ```java
    AuthenticationManager.authenticate(Authentication authentication)
    ```

- It also represents the currently authenticated user. The current `Authentication` can be obtained from the `SecurityContext.`

    ```java
    SecurityContextHolder.getContext().getAuthentication()
    ```

- Authentication provides the below details regarding an authenticated user:
    - `Principal` — which identifies the user. When authenticating with a username/password this is often an instance of `UserDetails` interface.
    - `Credentials`   — is basically the password
    - `GrandtedAuthorities` — provide the authorization scope for the principal. It is fine grained scope for authorization. `GrantedAuthorities` can be obtained from the `Authentication.getAuthorities()` method.

---

if you have reached this far and want to explore more on spring security. Here are a few posts to get you going.

	- username and password authentication using form login
	- inmemory
	- jpa based