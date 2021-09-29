---
layout: post
bannercolor: "blue dark-2"
title:  "Spring Security Oauth2- JWT Authentication in a resource server"
date:   2021-09-29
meta: "Spring security provides a minimal setup required to implement the JWT authentication in a resource server"
excerpt: "Spring security provides a minimal setup required to implement the JWT authentication in a resource server"
category: spring
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: igagrock
image: fbase.jpeg
categories:
    - spring
    - java
    - all

---

Oauth2 is an industry-standard protocol for authorization. 

As per Oauth2 specification([RFC-6749](https://datatracker.ietf.org/doc/html/rfc6749)) —

> *The OAuth 2.0 authorization framework enables a third-party application to obtain limited access to an HTTP service, either on behalf of a resource owner by orchestrating an approval interaction between the resource owner and the HTTP service, or by allowing the third-party application to obtain access on its own behalf.*
> 

The following diagram illustrates the working of an Oauth2 authentication request with an **Authorization Code Grant flow**. 

There are four parties involved —

- **Client:** Third party Application that wants access to the protected resource from a resource server.
- **Authentication Server:** Server which helps to authenticate a Resource Owner.
- **Resource Owner:** User that owns the protected resource.
- **Resource Server** : Server which serves the protected resources owned by Resource Owner.

&nbsp;&nbsp;

![Oauth2 -Auth code grant diagram.drawio.svg](/assets/images/oauth2-auth-code-grant.svg)

1. First of all, the client sends an authorization request to Resource Owner so that on behalf of the Resource Owner, it can access the protected resource(s).
2. If the *Authorization-code-grant* is used, the Authorization code is returned to the client. It means the Resource owner has given access to the client for protected resources.
3. The client sends this Authorization code to the Authentication Server, which in return provides an Authentication token — typically a JWT token.
4. Once the client has the authentication token, It use it to **access** the **protected resources** from a **resource server.** The token expires after a set timeout.

In this post, we will focus on the 4th step i.e. *How a Resource Server validates a JWT token provided by any third party client*. 

Let's first understand, what is JWT and Spring security API specs for JWT Authentication.

&nbsp;
## What is JWT?

👉🏼 Checkout the complete introduction at [jwt.io](https://jwt.io/introduction) 😜

&nbsp;
## Spring Security API for JWT Authentication 

The below diagram provides a thorough overview of Spring security API Specs for JWT Authentication.

![Spring-security-Oauth2.svg](/assets/images/spring-security-Oauth2-api-specs.svg)

- When a client submits a request along with bearer token. `BearerTokenAuthenticationFilter` creates a `BearerTokenAuthenticationToken` of the type `Authentication`.
- Next, The `AuthenticationManagerResolver` resolves the `AuthenticationManager` which in turn selects the specific `AuthenticationProvider`.
- The `BearerTokenAuthenticationToken` is passed to `AuthenticationProvider` by `ProviderManager`( the default Implementation of `AuthenticationManager`)
- For JWT authentication, `JwtAuthenticationProvider` is selected. It *decodes*, *verifies* and *validates* the **`Jwt`** using `JwtDecoder`.
- If the authentication succeeds, the Authentication is set on the `SecurityContextHolder`
- If the Authentication fails, `SecurityContextHolder` is cleared.

Finally, Let move ahead with implementing the JWT Authentication.

&nbsp;

## JWT Authentication in Spring Security

. In order to implement it, we would require the following components —

- **Authentication server** - we will use [Keycloak](https://www.keycloak.org/getting-started). It supports Oauth2.0.
- **Resource Server** - We will create one using  a spring-boot application.
- **Client** - We can use [Postman API client](https://www.postman.com/)  as the client.
- **User** - we will setup one user in Keycloak server.

&nbsp;

## Authentication server via Keycloak

- Follow this link to quickly [setup a Keycloak server via Docker.](https://www.keycloak.org/getting-started/getting-started-docker)
- Follow this  [tutorial to setup  Keycloak Authorization code grant](https://www.appsdeveloperblog.com/keycloak-authorization-code-grant-example/).

While you are at it, *here are few things, you would require once the Keycloak server is setup.*

- **issuer uri**  — *[http://](http://localhost:8080/auth/realms/realm)*[authserver.com](http://localhost:8080/auth/realms/dev/.well-known/openid-configuration)*[/auth/realms/{realm}](http://localhost:8080/auth/realms/realm)*
- **jwks-uri** — [http://](http://localhost:8080/auth/realms/dev/protocol/openid-connect/certs)[authserver.com/](http://localhost:8080/auth/realms/dev/.well-known/openid-configuration)[auth/realms/{realm}/protocol/openid-connect/certs](http://localhost:8080/auth/realms/dev/protocol/openid-connect/certs)
- **Metadata endpoint** —To use the `issuer-uri` property, the Authorization server should support either one of the below URLs as the metadata endpoint :
    - [http://authserver.com/auth/realms/{realm}/.well-known/openid-configuration](http://localhost:8080/auth/realms/dev/.well-known/openid-configuration). (Keycloak supports this one)
    - [https://auth-server.com/.well-known/openid-configuration/issuer](https://idp.example.com/.well-known/openid-configuration/issuer)
    - [https://auth-server.com/.well-known/oauth-authorization-server/issuer](https://idp.example.com/.well-known/oauth-authorization-server/issuer)

 *Make sure to replace [authserver.com](http://authserver.com) with valid domain. Also make sure to provide the value value for `realm`*

Once you have the `Keycloak` server ready — Let's go ahead and create a resource server. 

## Resource Server

The resource server will be the simplest one and will contain only one secure rest API. 

### Dependencies:

- `spring-security-oauth2-resource-server` ****— Most of the resource server support is collected here.
- `spring-security-oauth2-jose` — provides support for decoding and verifying JWT.

```xml
<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
		<groupId>org.springframework.security</groupId>
		<artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
```

&nbsp;

### API Endpoint

`GET /api/v1/users`

```java
@RestController
@RequestMapping("/api/v1")
public class UserController {

    @GetMapping("/users")
    public List<User> getUsers(){
        return Arrays.asList(
                new User("john doe", 100),
                new User("jane doe",300)
        );
    }
}
```

Since we have Spring security in the class path, every route will be private.

&nbsp;
### Setup JWT issuer URL

This is minimal setup required to implement the JWT authentication. The `issuer-url` provided is used by Resource Server to discover public keys of authorization server and validate the token. It is also the same URL present in **`iss`** claim.

```yaml
Spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-url: http://localhost:8080/auth/realms/{realm}
```

**When the Resource server is started up**, it will automatically configure itself to validate JWT encoded Bearer Token. It achieves this querying the Authorization Server *metadata endpoint* for `jwks_url` property. This provides access to supported algorithm and its valid public keys.

 The Only drawback to this setup is that it fails if the Authentication server is not already up. To void startup failure, we would need to add the `jwk-set-uri` 

```yaml
Spring:
	security:
		oauth2:
			resourceserver:
				jwt:
					issuer-url: http://localhost:8080/auth/realms/dev
					jwk-set-uri: http://localhost:8080/auth/realms/{realm}/protocol/openid-connect/certs

```

Now, the Resource Server will not ping the authorization server at startup. However, `issuer-uri` is still kept to validate the JWT `iss` claim on incoming token.

*Spring Security  provides extension points to override or customize the default behavior of the implementation. We will look into customizing some of the default features*. 

...But before that, Let's test the default implementation.

&nbsp;
## Time to Test the Implementation 💎

If you recall, the resource server contains one endpoint with path `/api/v1/users`. If we call it without providing an authentication token, it will return `401 - Unauthorized` status. That is due absence of authorization token.

Let's see how we can can use *authorization code grant* to fetch a token from the `Keycloak` server and use it to access the `API` provided by the resource server.

&nbsp;
### **Step - 1: Request OAuth Authorization Code**
At this point, we would need a client to request the Authorization code. 
However to make it easier to test, we can run the following URL in the browser. It should redirect you to the login page and you will have to provide the credentials of the user. 

```bash
http://authserver.com/auth/realms/{realm}/protocol/openid-connect/auth
?client_id=your-client-id&response_type=code&state=app-state
```

After the successful completion, it will redirect you to the `redirect-url` with the values similar to below. 

```bash
http://{redirect-url}/?state=appstate
&session_state=d7c5d4de-c883-494a-a2a2-e5108062830c
&code=f5935f66-88e0-4085-80aa-000b2a6b2b51.d7c5d4de-c883-494a-a2a2-e5108062830c.bf89a5ff-5703-42d6-9534-ca59f667f81f
```

We would require `code` to fetch the actual token.

&nbsp;
### Step - 2: Fetch the Authentication Token

```bash
curl -L -X POST "http://localhost:8080/auth/realms/dev/protocol/openid-connect/token" \
-H "Content-Type: application/x-www-form-urlencoded" \
-H "Cookie: JSESSIONID=E8D36F0DBCBF7E33130B9125F8795CAC.9b51ecd0cc5c; JSESSIONID=8E34666DECDB395B1754FD08C5B385F2" \
--data-urlencode "client_id=client-id-value" \
--data-urlencode "client_secret=client-secret-uuid" \
--data-urlencode "grant_type=authorization_code" \
--data-urlencode "code=92236b97-c48f-4827-ae80-80a46e39a0f2.d7c5d4de-c883-494a-a2a2-e5108062830c.bf89a5ff-5703-42d6-9534-ca59f667f81f" \
--data-urlencode "redirect-uri=http://localhost:8085"
```

- `client-id`, `client-secret` can be fetched from the client credentials in `Keycloak` server.
- `grant_type = authorization_code` describes the grant type used.
- `code` fetched in the Step-1.
- `redirect-url` should be same as configured for client in `Keycloak` server.

The response returned would look similar to the below example:

```json
{
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0S1ZQNGVhRVdjdno4ZjRndXlPd05XTE9GWFEzYWo0b1I0eWx0dkFSZldFIn0.eyJleHAiOjE2MzI5MzMzOTksImlhdCI6MTYzMjkzMzA5OSwiYXV0aF90aW1lIjoxNjMyOTMzMDgyLCJqdGkiOiIzZTk1NGRkMi0zMjhhLTQ3NzItYWQ2NS0xOWQ3NGM2MGZjZGEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvZGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImMzNjFkMGVjLWM1MWItNGRmNy05MTA1LTVhOWUyZGViMmRjOCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlc291cmNlc2VydmVyIiwic2Vzc2lvbl9zdGF0ZSI6ImMyYWRiODIyLWQwY2ItNDY3MC1iYmNjLWU3NWJlOTkyYzg5OSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1kZXYiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVzb3VyY2VzZXJ2ZXIiOnsicm9sZXMiOlsiVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiYzJhZGI4MjItZDBjYi00NjcwLWJiY2MtZTc1YmU5OTJjODk5IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJ1c2VyX25hbWUiOiJ1c2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidXNlciJ9.A66uqbRwsUL36GSGozZ7FC3x-M4SCYYLaABMdps-XneseP1saIjsTbHO2QrYq2HbD9jl6nKTYxJHjMdbsRJyY3VtM2mf1D8W24-u8y8qmGf1YNbtFfSTZyrUmwiACEv17onAT8wKgR0C4sdbVFETpRY12f2qQb0mM4ZkT9QQ5DYPBu6dnwyBVXLYJzn8kfmp7JB0OR6LsBTTtyh03t_xiRwb1nSALbUmwq7iUk9lTFEUuUZ182p05q3TKxy9b_kxrCh91EYoYWUdBEhRM4yHjrvN99T-MFpRVaCadyn2YibFbCeZHpsqUmgi-ghR3I70U70HGsL22FEAE4N9X5y_pg",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzZGU1NjBjZi1kMDZlLTRiZmItODY2Yi1mNzJhYjk0YjA0NGMifQ.eyJleHAiOjE2MzI5MzQ4OTksImlhdCI6MTYzMjkzMzA5OSwianRpIjoiODQ5OWNmY2QtZjY1Yy00YzdhLThhNDctMzdhNjg4ZGZjMjU0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL2RldiIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoL3JlYWxtcy9kZXYiLCJzdWIiOiJjMzYxZDBlYy1jNTFiLTRkZjctOTEwNS01YTllMmRlYjJkYzgiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoicmVzb3VyY2VzZXJ2ZXIiLCJzZXNzaW9uX3N0YXRlIjoiYzJhZGI4MjItZDBjYi00NjcwLWJiY2MtZTc1YmU5OTJjODk5Iiwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiYzJhZGI4MjItZDBjYi00NjcwLWJiY2MtZTc1YmU5OTJjODk5In0.747XKhyNqZCDEzSfLV4K96sgAW0daN1C1ROUr5L_s_E",
    "token_type": "Bearer",
    "not-before-policy": 0,
    "session_state": "c2adb822-d0cb-4670-bbcc-e75be992c899",
    "scope": "email profile"
}
```
&nbsp;

### Step - 3: Run the API with

We will use the `access_token` value from previous response as the bearer token to run the private API — (`api/v1/users`) provided by resource server.

```bash
curl -L -X GET "http://localhost:8090/api/v1/users" \
-H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0S1ZQNGVhRVdjdno4ZjRndXlPd05XTE9GWFEzYWo0b1I0eWx0dkFSZldFIn0.eyJleHAiOjE2MzI5MzMzOTksImlhdCI6MTYzMjkzMzA5OSwiYXV0aF90aW1lIjoxNjMyOTMzMDgyLCJqdGkiOiIzZTk1NGRkMi0zMjhhLTQ3NzItYWQ2NS0xOWQ3NGM2MGZjZGEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvZGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImMzNjFkMGVjLWM1MWItNGRmNy05MTA1LTVhOWUyZGViMmRjOCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlc291cmNlc2VydmVyIiwic2Vzc2lvbl9zdGF0ZSI6ImMyYWRiODIyLWQwY2ItNDY3MC1iYmNjLWU3NWJlOTkyYzg5OSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1kZXYiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVzb3VyY2VzZXJ2ZXIiOnsicm9sZXMiOlsiVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiYzJhZGI4MjItZDBjYi00NjcwLWJiY2MtZTc1YmU5OTJjODk5IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJ1c2VyX25hbWUiOiJ1c2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidXNlciJ9.A66uqbRwsUL36GSGozZ7FC3x-M4SCYYLaABMdps-XneseP1saIjsTbHO2QrYq2HbD9jl6nKTYxJHjMdbsRJyY3VtM2mf1D8W24-u8y8qmGf1YNbtFfSTZyrUmwiACEv17onAT8wKgR0C4sdbVFETpRY12f2qQb0mM4ZkT9QQ5DYPBu6dnwyBVXLYJzn8kfmp7JB0OR6LsBTTtyh03t_xiRwb1nSALbUmwq7iUk9lTFEUuUZ182p05q3TKxy9b_kxrCh91EYoYWUdBEhRM4yHjrvN99T-MFpRVaCadyn2YibFbCeZHpsqUmgi-ghR3I70U70HGsL22FEAE4N9X5y_pg" \
-H "Cookie: JSESSIONID=8E34666DECDB395B1754FD08C5B385F2"
```

Response:

```json
[
    {
        "name": "John Doe",
        "age": 100
    },
    {
        "name": "Jane Doe",
        "age": 300
    }
]
```
&nbsp;

## Customize the default Implementation

&nbsp;
### Provide custom JWT Converter

A JWT Converter is responsible for converting a JWT Bearer token into a valid `JwtAuthenticationToken` which is of the type Authentication. In order to provide a customer converter, we will need to override `WebSecurityConfigurerAdapter` and supply an instance of the custom converter.

```java
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
										.anyRequest().authenticated()
                .and()
                .oauth2ResourceServer()
	                .jwt().jwtAuthenticationConverter(new JwtAuthenticationConverter());
    }
}
```
&nbsp;
### Change the default JWT Decoder

A [JwtDecoder](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/oauth2/jwt/JwtDecoder.html) decodes a JWT token into an instance of `Jwt` instance. `Jwt` instance is the java representation of JSON Web Token.   Please refer to [Jwt  docs](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/oauth2/jwt/Jwt.html) for the proper understanding. 

The default implementation is `NimbusJwtDecoder`. We can either provide a custom `JwtDecoder bean` or directly provide the instance of it.

```java
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests().anyRequest().authenticated()
                .and()
                .oauth2ResourceServer()
                    .jwt().jwtAuthenticationConverter(new JwtAuthenticationConverter());
    }

    @Bean
    public JwtDecoder jwtDecoder(){
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }
}

```

```java
	@Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests().anyRequest().authenticated()
                .and()
                .oauth2ResourceServer()
                    .jwt().decoder(NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build());
    }
```
&nbsp;
### Configure Authorization

By default, Spring Security uses JWT claims such as `scope` or `scp` to fetch the scopes present in the JWT and map it to `GrantedAuthorities` . While mapping, It will also prepend the scope with `SCOPE_`.
Here, we will see —

- how to change the default Prefix.
- How to use a different claim name to fetch the authorities.

In order to change the default implementation, we will have to provide a customized instance of `JwtGrantedAuthoritiesConverter`. It is responsible for converting the JWT scopes to `GrantedAuthorities`. 

 `JwtAuthenticationConverter` which is responsible to convert JWT to a valid [Authentication](http://Authentication.IT) . Below example shows how to change the Authorities claim name and authority prefix. 

```java
		@Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        //change the prefix  to ROLE_
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        
        //change the default claim name. default claim is "scope", "scp"
        grantedAuthoritiesConverter.setAuthoritiesClaimName("c_scope");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
```

Assuming the JWT token has  claim such as `{.... ,"c_scope: 'profile dashboard' "}` .The granted authorities will be mapped as `ROLE_profile, ROLE_dashboard`

&nbsp;
### Configure Timeouts

Sometimes the default timeout of **30** seconds for connections and sockets won't suffice. 

`JwtDecoder` accepts an instance of `RestOperation` . A `RestTemplate` is the implementation of `RestOperation.` We can set custom values to `connectTimeout` and `readTimeout` to change the default values.

```java
@Bean
    public JwtDecoder jwtDecoder(RestTemplateBuilder restTemplateBuilder){

        RestTemplate restOperations = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(90))
                .setReadTimeout(Duration.ofSeconds(90))
                .build();

       return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).restOperations(restOperations).build();
    }
```
&nbsp;
### Configuring Timestamp validations.

JWT is valid between a certain time period. `nbf` and `exp` claims contain start and end of the valid time period respectively.

However, in  distributed environments, It is possible to experience **[clock drift**.](https://en.wikipedia.org/wiki/Clock_drift#:~:text=From%20Wikipedia%2C%20the%20free%20encyclopedia,desynchronizes%20from%20the%20other%20clock.) As a result, JWT might occur invalid in some servers. To overcome this, we can provide a [Clock Skew](https://en.wikipedia.org/wiki/Clock_skew) to compensate for the clock drift time.

The `DelegatingOAuth2TokenValidator` takes an array of validators which are used for validating the JWT token. We can use `JwtTimestampValidator` and supply a time offset value.

```java
@Bean
    public JwtDecoder jwtDecoder(RestTemplateBuilder restTemplateBuilder) {

        OAuth2TokenValidator<Jwt> clockSkew
                = new DelegatingOAuth2TokenValidator<>(
new JwtTimestampValidator(Duration.ofSeconds(60)));

        nimbusJwtDecoder.setJwtValidator(clockSkew);
        return nimbusJwtDecoder;
    }
```
&nbsp;
### Set Jwks-uri through DSL

We can set  `jwks-uri`  via DSL. This can be useful to provide different authentication servers for different environments without having to change the configurations.

```java
public class SecurityConfig extends WebSecurityConfigurerAdapter{

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests().anyRequest().authenticated()
                .and()
                .oauth2ResourceServer()
                    .jwt().jwkSetUri(jwkSetUri);
    }

}
```
&nbsp;
### Provide a custom location for public key

If the Oauth2 server doesn't provide  a `jwks-uri` and you want to setup a location for public key. It can be set either through properties or configure `JwtDecoder` bean

```java
// VIA spring boot
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          public-key-location: classpath:my-key.pub
```

```java
// use decoder
@Bean
public JwtDecoder jwtDecoder() {
    return NimbusJwtDecoder.withPublicKey(this.key).build();
}
```