---
layout: post
bannercolor: "blue dark-2"
title:  "Spring Security - In-Memory Authentication using DaoAuthenticationProvider"
date:   2021-08-18
meta: "DaoAuthenticationProvider uses UserDetailsService and a password encoder to authentication username password based authentication"
excerpt: "DaoAuthenticationProvider uses UserDetailsService and a password encoder to authentication username password based authentication"
category: spring
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: igagrock
image: user-pass.jpeg
categories:
    - spring
    - java
    - all

---

Spring Security provides `DaoAuthenticationProvider` which requires a `UserDetailsService` and a `passwordEncoder` bean to perform *username and password* authentication.

Please note — we will use a spring boot project. You can access the maven dependencies [here](https://github.com/initgrep-post-demos/nauth/blob/auth-providers/pom.xml).

### Create a Spring Configuration class and extend to `WebSecurityConfigurerAdapter`

Override the `configure(AuthenticationManagerBuilder auth)`

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

@Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		//we will set the newly created authentication provider here.
		// for example: auth.authenticationProvider(ourcustomAuthProviderInstance)
	}
}
```

### Add a password encoder bean

we are `BCryptPasswordEncoder` here.

```java
@Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(4);
  }
```

### Create an instance of `UserDetailsService`

we will return an instance of `InMemoryUserDetailsManager` It is an implementation of `UserDetailsService` interface.

`InMemoryUserDetailsManager`  provides constructors which can take either a `collection` or `varargs` array of `UserDetails` instance. That means, you are free to add multiple `UserDetails` instances .

```java
public UserDetailsService inMemoryUserDetailsService() {
    UserDetails user1 = User.builder()
      .username("user1")
      .password("password")
      .roles("USER")
      .passwordEncoder((password) -> passwordEncoder().encode(password))
      .build();
    return new InMemoryUserDetailsManager(user1);
  }
```

### Create a bean of `DaoAuthenticationProvider`

we will also set the instances 

```java
@Bean
  public DaoAuthenticationProvider inMemoryDaoAuthenticationProvider() {
    DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
    daoAuthenticationProvider.setUserDetailsService(inMemoryUserDetailsService());
    daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
    return daoAuthenticationProvider;
  }

```

Finally add the `DaoAuthenticationProvider` in the configure method.

```java
@Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.authenticationProvider(inMemoryDaoAuthenticationProvider());
  }
```

That is it. You can now run your Spring boot application and use the username and password of the user you just created for login.

You can access the source code from the GitHub repo [here](https://github.com/initgrep-post-demos/nauth/blob/auth-providers/src/main/java/com/initgrep/apps/nauth/config/SecurityConfig.java)