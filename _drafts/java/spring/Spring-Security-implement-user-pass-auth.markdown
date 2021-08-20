---
layout: post
bannercolor: "blue dark-2"
title:  "Spring Security- How to implement username and password authentication"
date:   2021-08-18
meta: "Username and password authentication is one of most commonly used methods. Spring security provides API's to configure form-based login, basic authentication and many more with storage options such as JDBC authentication, in-memory authentication as well as custom authentication providers "
excerpt: "Username and password authentication is one of most commonly used methods. Spring security provides API's to configure form-based login, basic authentication and many more with storage options such as JDBC authentication, in-memory authentication as well as custom authentication providers "
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

This is one of the most commonly used types of authentication. The user is authenticated using a *username* and *password*.

With Spring Security, The username and password authentication is usually configured in two steps —

1. The first step is to decide how to fetch *username* and *password* from the client.

    example: *Form-based authentication, basic authentication*

2. The second step involves deciding how to store and read the *username* and *password*.

    example: *In-memory authentication, JDBC authentication, LDAP* or all of them together

We will use **form-based** authentication to read the *username* and *password* from the client. 

To store the information we will configure In-memory authentication. we will also configure a JPA based AuthenticationProvider to read and store users from a persistent storage such as MySQL.

Please note - we will use a spring boot project. You can access the maven dependencies [here](https://github.com/initgrep-post-demos/nauth/blob/auth-providers/pom.xml).

&nbsp;&nbsp;
## Form based login

Form-based login is enabled by default in spring boot security. When the application first boots up, It provides a default login page. The default *username* is `user` and the *password* is randomly generated string printed in console.

```text
Using generated security password: f18e74c5-8d87-4ec9-8900-4f03869deb26
```
&nbsp;
### Customize Form based Login

To Change the defaults, Spring security has provided two extension points —

1. we can extend to `WebSecurityConfigurerAdapter` class and expose it as a `@Configuration` ( we will be using this one)
2. We can implement `WebSecurityConfigurer` interface and expose it as a `@Configuration`. 

In this post, we will use the first option. You are free to try the second option as well.

&nbsp;
### Configure login and logout pages

let's create a new class and extend it with `WebSecurityConfigurerAdapter`. After that, override `configure(HttpSecurity http)` as below. 

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
       http
	      .authorizeRequests()
	      .anyRequest().authenticated()
	      .and()
	      .formLogin().loginPage("/login").permitAll()
	      .and()
	      .logout().logoutUrl("/logout");
    }

}
```

In the above example:

- `authorizeRequests` enables access restrictions based upon the `HttpServletRequest` using URL patterns.
- `anyRequest().authenticated()` means any request should be authenticated.
- `formLogin()` specifies support for form based authentication.
- `loginPage(loginPageUri)` configures a custom login page.
- `permitAll()` will permit all the requests to `/login` URL.
- `and()` method gives the reference to `SecurityBuilder`
- `logout()` provides logout support
- `logoutUrl("/logout")` configures custom logout page

&nbsp;&nbsp;
### Create templates for Login and Logout Routes
Next — we need to create two html pages in ***resource/templates*** directory for login and logout.

**Path:** *resources/templates/login.html*

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="https://www.thymeleaf.org">
<head>
  <title>Please Log In</title>
</head>
<body>
<h1>Please Log In</h1>
<form th:action="@{/login}" method="post">
  <div>
    <input type="text" name="username" placeholder="Username"/>
  </div>
  <div>
    <input type="password" name="password" placeholder="Password"/>
  </div>
  <input type="submit" value="Log in" />
</form>
</body>
</html>
```

**Path**: *resources/templates/logout.html*

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="https://www.thymeleaf.org">
<head>
  <title>Please Log In</title>
</head>
<body>
<form th:action="@{/logout}" method="post">
  <button class="submit">logout</button>
</form>
</body>
</html>
```


&nbsp;
> we are using thymeleaf template engine.

Next - we need to create a controller which maps `GET /login` and `GET /logout` paths with respective templates.

```java
@Controller
public class TemplateController {

  @GetMapping("/login")
  public String login() {
    return "login";
  }

  @GetMapping("/logout")
  public String logout() {
    return "logout";
  }
}
```

Once you are done, start up your Spring boot application.
Assuming you did not change the default  ports, go to [http://localhost:8080/login](http://localhost:8080/login). It should now display the new Login page. 

Once you fill user and auto generated password - Login should be successful. It will not redirect you to any thing useful yet. 

Next — hit [http://localhost:8080/logout](http://localhost:8080/logout). It should show the new logout page now. Click on the logout button. Application performs logout and redirects you to login page.

&nbsp;
### Configure routes for successful or failed login

Let's configure a default route where the user will be redirected after login. The route configured does not have to be only HTML page. It can also be a rest API route.

&nbsp;

**Configure success callback with `defaultSuccessUrl` method**

**`defaultSuccessUrl(String path)`** is used to configure the default success URL.

```java
protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
      .anyRequest().authenticated()
      .and()
      .formLogin().loginPage("/login").permitAll()
      **.defaultSuccessUrl("/home")**
      .and()
      .logout().logoutUrl("/logout");
  }
```

In the `templateController` class, we will have to add one more route for home page.

```java
@Controller
public class TemplateController {

  @GetMapping("/login")
  public String login() {
    return "login";
  }

  @GetMapping("/logout")
  public String logout() {
    return "logout";
  }

  @GetMapping("/home")
  public String home() {
    return "home";
  }
}
```
&nbsp;
#### Create Homepage template
Finally we will create HTML page for home route. Go ahead and create a page in `/resources/templates` and name it `home.html`.


Now try to login again. This time it will redirect you to home page.

Similarly we can configure routes if the login fails by providing the route path to `failureForwardUrl()` method.

&nbsp;&nbsp;
### Configure Authentication handlers

We can also configure listeners for successful and failed authentication.

you can either configure routes or use authentication handlers. Handlers are powerful and can be used to perform any operations on login success or login fail.

- `successHandler(AuthenticationSuccessHandler successHandler)`is used to configure handler for successful login.
- `failureHandler(AuthenticationFailureHandler authenticationFailureHandler)` is used to configure listener for failed login.

 

```java
@Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
      .anyRequest().authenticated()
      .and()
      .formLogin().loginPage("/login").permitAll()
      .successHandler(((request, response, authentication) -> {
        //Log the loggedIn user
        System.out.println("LoggedIn user " + authentication.getPrincipal());
      }))
      .failureHandler((request, response, exception) -> {
        //log exception message
        System.err.println("Login failed ->" + exception.getMessage());
      })
      .and()
      .logout().logoutUrl("/logout");
  }
```

&nbsp;&nbsp;
## Configure Storage mechanism
- in-memory authentication 
- JPA based authentication