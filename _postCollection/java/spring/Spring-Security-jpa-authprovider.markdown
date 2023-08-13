---
layout: post
bannercolor: "blue dark-2"
title:  "Spring Security - JPA implemenation of UserDetailsService For DaoAuthenticationProvider"
date:   2021-08-18
meta: "JPA based AuthenticationProvider to provider username and password authentication"
excerpt: "JPA based AuthenticationProvider to provider username and password authentication"
category: spring
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: irshsheik
image: user-pass.jpeg
categories:
    - spring
    - java
    - all

---

Spring security provides `DaoAuthenticationProvider` for username and password authentication.

Spring Security provides `DaoAuthenticationProvider` which requires a `UserDetailsService` and a `passwordEncoder` bean to perform *username and password* authentication.

Please note — we will use a spring boot project. You can access the maven dependency [here](https://github.com/initgrep-post-demos/nauth/blob/auth-providers/pom.xml) to initialize the project.

This tutorial will focus on - 

- How to leverage Spring Data JPA to  connect to a persistent database such as MySQL
- How to create `UserDetails` Entity using JPA annotations.
- How to create custom `UserDetailsManager` implementation which fetches data using JPA repository.

&nbsp;&nbsp;
## Configure the dataSource

Add the below configuration in the  [`application.properties`](http://application.properties) file. I have provided a demo config for configuring a MySQL database. you are free to use a database of your choice. Make sure you give the correct url, username and password.

```java
spring.datasource.url=jdbc:mysql://localhost:3306/nauth_db
spring.datasource.username=user
spring.datasource.password=pass
```

&nbsp;&nbsp;
## Create an Entity of `UserDetail` type

Let's implement `UserDetails` interface and implement all the methods. 

```java
@Entity
public class AuthUserDetails implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String username;
  private String password;
  private boolean accountNonExpired;
  private boolean accountNonLocked;
  private boolean credentialsNonExpired;
  private boolean enabled;

  @OneToMany(mappedBy = "authUserDetails", fetch = FetchType.EAGER)
  private Set<AuthGrantedAuthority> authorities;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return this.authorities;
  }

  @Override
  public String getPassword() {
    return this.password;
  }

  @Override
  public String getUsername() {
    return this.username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return this.accountNonExpired;
  }

  @Override
  public boolean isAccountNonLocked() {
    return this.accountNonLocked;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return this.credentialsNonExpired;
  }

  @Override
  public boolean isEnabled() {
    return this.enabled;
  }

//setters 
}
```

&nbsp;&nbsp;
Since `UserDetails` can have a set of authorities. we will also need another entity for `GrantedAuthorities` to maintain a **one-to-many** relationship.

```java
@Entity
public class AuthGrantedAuthority implements GrantedAuthority {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Long id;

  private String authority;

  @ManyToOne
  @JoinColumn(name = "auth_user_detail_id")
  private AuthUserDetails authUserDetails;

		//constructors
		//getters and setters

}
```

&nbsp;&nbsp;
## Create the Repositories for the above entities.

We will also have to create a repository for both `UserDetails` and `GrantedAuthorities` Entities which implements `JpaRepository` interface.

`findByUsername` and `findByPassword` methods are required later when we will create a Custom `UserDetailsManager`

```java
@Repository
public interface AuthUserDetailsRepository extends JpaRepository<AuthUserDetails, Long> {
  Optional<AuthUserDetails> findByUsername(String username);
  Optional<AuthUserDetails> findByPassword(String password);
}
```

The repository interface for `GrantedAuthorities` does not require any custom methods.

```java
public interface AuthGrantedAuthorityRepository extends JpaRepository<AuthGrantedAuthority, Long> {
}
```

&nbsp;&nbsp;
## Create an implementation of `UserDetailsManager`

`UserDetailsManager` interface extends to `UserDetailsService` class.  So we are ideally creating an implementation of `UserDetailsService` with some extra methods.

```java
@Service
public class JpaUserDetailsManager implements UserDetailsManager {

  @Autowired
  private AuthUserDetailsRepository repository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    repository.findByUsername(username);
    .orElseThrow(
      () -> new UsernameNotFoundException("No user found with username = " + username));
  }

  @Override
  public void createUser(UserDetails user) {
    repository.save((AuthUserDetails) user);
  }

  @Override
  public void updateUser(UserDetails user) {
    repository.save((AuthUserDetails) user);
  }

  @Override
  public void deleteUser(String username) {
    AuthUserDetails userDetails = repository.findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException("No User found for username -> " + username));
    repository.delete(userDetails);
  }

  /**
   * This method assumes that both oldPassword and the newPassword params
   * are encoded with configured passwordEncoder
   *
   * @param oldPassword the old password of the user
   * @param newPassword the new password of the user
   */
  @Override
  @Transactional
  public void changePassword(String oldPassword, String newPassword) {
    AuthUserDetails userDetails = repository.findByPassword(oldPassword)
      .orElseThrow(() -> new UsernameNotFoundException("Invalid password "));
    userDetails.setPassword(newPassword);
    repository.save(userDetails);
  }

  @Override
  public boolean userExists(String username) {
    return repository.findByUsername(username).isPresent();
  }
}
```

Next , we will create a configuration which will extend to `WebSecurityConfigurerAdapter`. We will also add `JpaUserDetailsManager` as a  dependency to it. 

We will also add `passwordEncoder` bean to it.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

@Autowired
  private JpaUserDetailsManager jpaUserDetailsManager;

@Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(4);
  }

}
```

&nbsp;&nbsp;
## Create a bean of `DaoAuthenticationProvider`

```java
@Autowired
private JpaUserDetailsManager jpaUserDetailsManager; 

@Bean
  public DaoAuthenticationProvider jpaDaoAuthenticationProvider() {
    DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
    daoAuthenticationProvider.setUserDetailsService(jpaUserDetailsManager);
    daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
    return daoAuthenticationProvider;
  }
```

Finally, override the  `configure(AuthenticationManagerBuilder auth)` of  the `WebSecurityConfigurerAdapter` class  and  add the `jpaDaoAuthenticationProvider`  bean to `AuthenticationManagerBuilder`.

```java
@Override
  protected void configure(AuthenticationManagerBuilder auth) {
    auth.authenticationProvider(jpaDaoAuthenticationProvider());
  }
```

&nbsp;&nbsp;
## Configure multiple `AuthenticationProvider`s

If you have come across a scenario where you would require to search different data stores for user details for  authentication. You can create the custom implementations of `UserDetailsManager` as we did in this post.

After that you can add multiple `AuthenticationProviders` to `AuthenticationManagerBuilder` in the configure method.


```java
@Override
  protected void configure(AuthenticationManagerBuilder auth) {
    auth.authenticationProvider(jpaDaoAuthenticationProvider());
		auth.authenticationProvider(inMemoryDaoAuthenticationProvider());
		auth.authenticationProvider(firebaseDaoAuthenticationProvider());
  }
```

You can also go through the post about [in-memory username and password authentication using spring security](/posts/java/spring/Spring-Security-in-memory-auth) and try adding that `AuthenticationProvider` in the configure method.

## Finally - Add the data to Database in Spring boot application

Since we have not created any users for testing. 

you can either —

- directly add the `userdetails` in database
- or use `data.sql` file in the resources to provide the initial data.
- or use the `commandLineRunner` to add data when the application starts.

Below is an example of `commandLineRunner` bean.

```java
@Configuration
public class DBInitializerConfig {
  @Autowired
  private AuthUserDetailsRepository authUserDetailsRepository;

  @Autowired
  private AuthGrantedAuthorityRepository authGrantedAuthorityRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  // initialize the user in DB
  @Bean
  public CommandLineRunner initializeJpaData() {
    return (args)->{
      System.out.println("application started");

      //uncomment if required

      AuthUserDetails user2 = new AuthUserDetails();
      user2.setUsername("user2");
      user2.setPassword(passwordEncoder.encode("password"));
      user2.setEnabled(true);
      user2.setCredentialsNonExpired(true);
      user2.setAccountNonExpired(true);
      user2.setAccountNonLocked(true);

      AuthGrantedAuthority grantedAuthority = new AuthGrantedAuthority();
      grantedAuthority.setAuthority("USER");
      grantedAuthority.setAuthUserDetail(user2);
      authUserDetailsRepository.save(user2);
      authGrantedAuthorityRepository.save(grantedAuthority);
      user2.setAuthorities(Collections.singleton(grantedAuthority));
    };

  }
}
```