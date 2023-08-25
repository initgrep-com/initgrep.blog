---
layout: post
bannercolor: "blue dark-2"
title:  "Implement Firebase custom tokens with Spring security"
date:   2021-08-24
meta: "Firebase custom tokens allows us to authenticate users with JWT tokens generated in our own servers."
excerpt: "Firebase custom tokens allows us to authenticate users with JWT tokens generated in our own servers."
category: spring
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: irshsheik
image: /assets/images/fbase.jpeg
categories:
    - spring
    - java
    - all

---

OK, Let me start with a little disclaimer —

> You don't have to use Spring Security to implement Firebase custom tokens. You could use any Authentication server to authorize a rest API. That is all we will be doing here. However, I would like to show it under the purview of spring security.

## Problem statement —

You have an existing application that already uses firebase for authentication. Suddenly, you have to authenticate users against one more authentication server — typically an in-house server.

You got two options —

1. Start coding a new component that will authenticate users with both firebase and a custom auth server.
2. You can just use the existing firebase.

Of course — you would want to go with just firebase. It is easy, has a fluent and battle tested API and your application is supposedly already using it.

Moreover, if you have multiple apps already using firebase and each of them needs this new functionality. All you have to add are a few lines of code and you are good to go..!

If you want to really know how many lines — here is an example from firebase web SDK —

I would love to explain this example but we talking about something else. Feel free to check out the [firebase docs](https://firebase.google.com/docs/auth/web/custom-auth#web-v8) for the same.

```jsx
firebase.auth().signInWithCustomToken(token)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
```

&nbsp;&nbsp;

## Steps to Implement Firebase custom tokens

&nbsp;
### Initialize a new Spring boot security application

I have already created a post that explains [how to create an in-memory username and password authentication](/posts/java/spring/Spring-Security-in-memory-auth). That is all we need.

&nbsp;
### Add Firebase Admin SDK to the project

You can use one of the below depending on the build system.

**build.gradle**

```json
dependencies {
  implementation 'com.google.firebase:firebase-admin:8.0.1'
}
```

**pom.xml**

```xml
<dependency>
  <groupId>com.google.firebase</groupId>
  <artifactId>firebase-admin</artifactId>
  <version>8.0.1</version>
</dependency>
```

&nbsp;
### Create a service account with firebase

You would require a service account to proceed further. I would suggest checking out this [document](https://firebase.google.com/docs/admin/setup) to set up a service account.

Once you are done with the service account, download the firebase config JSON file.

You have two options to authorize via service accounts —

- Add an environment variable `GOOGLE_APPLICATION_CREDENTIALS` and point to the JSON file. This is recommended approach and we will be using the same one.
- Explicitly specify the path to the JSON file.

&nbsp;
### Initialize the Firebase Admin SDK

We will create a Spring configuration bean and initialize the firebase Admin SDK in `@PostConstruct`.

```java
@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseAuth firebaseAuth(){
        return FirebaseAuth.getInstance();
    }

    @PostConstruct
    public void initializeFirebaseApp() throws IOException {
       
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.getApplicationDefault())
									
                .setServiceAccountId(SERVICE_ACCOUNT_ID)
                .build();
        FirebaseApp.initializeApp(options);
    }
}
```

&nbsp;
### Create the custom token

We will create a rest API that will return a token minted via the `FirebaseAuth` Object.

`FirebaseAuth.createCustomToken(uid)` method is used to create a custom token for a UID. The UID should uniquely identify a user. Optionally, we can add additional claims to this token via the overloaded `createCustomToken` method. 👇🏼

```java
createCustomToken(
    @NonNull String uid, @Nullable Map<String, Object> developerClaims){}
```

Spring security `Authentication` interface provides  `Authentication.getName()` method which represents the username of the current user. we can safely use it for the uid.

We will also add `grantedAuthorities` to the token via claims.

```java
@RestController
public class TokenController {

    @Autowired
    private FirebaseAuth firebaseAuth;

    @GetMapping("/token")
    public Map<String, String> getToken() throws FirebaseAuthException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

				//joining elements of collections as comma seperated string
        String authorities = authentication.getAuthorities()
                .stream()
                        .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.joining(","));
        System.out.println(authorities);
        String customToken = firebaseAuth.createCustomToken("andrew", Collections.singletonMap("authorities", authorities));
        return Collections.singletonMap("token", customToken);
    }

}
```

&nbsp;
### Finally — Configure Spring Security

The API created to fetch the token should be secured so that only logged in user should be able to fetch a new token.

`anyRequest().authenticated()` will authenticate all the requests. We will be using http basic authentication.

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      http
                .httpBasic()
                .and()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .cors().configurationSource(new CorsConfigurationSource() {
                    @Nullable
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration config = new CorsConfiguration();
                        config.setAllowCredentials(true);
                        config.addAllowedOrigin("*");
                        config.addAllowedHeader("*");
                        config.addAllowedMethod("*");
                        return config;
                    }
                })
                .and()
                .authorizeRequests()
                .anyRequest().authenticated();
    }

}
```

&nbsp;
## Usage:

Assuming the authentication server is at  [localhost:8080](http://localhost:8080). we can use the below request to fetch the token.

```java
curl --location --request GET 'http://localhost:8080/token' \
--header 'Authorization: Basic dGVzdFVzZXIxOnBhc3N3b3Jk' \
```

This request will return a JWT token which can be used for authentication via the firebase client.