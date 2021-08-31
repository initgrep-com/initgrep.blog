---
layout: post
bannercolor: "blue dark-2"
title:  "Spring Bean Scopes and Lookup method injection"
date:   2021-09-01
meta: "Spring Bean Scope defines the lifecycle and the visibility of the instances created from the bean definitions."
excerpt: "Spring Bean Scope defines the lifecycle and the visibility of the instances created from the bean definitions"
category: spring
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: igagrock
image: bean-scope.jpeg
categories:
    - spring
    - java
    - all

---

Spring Bean Scope defines the lifecycle and the visibility of the instances created from the bean definitions.

> This article is focused on — ***how to inject a bean with a shorter-lived scope such as a `prototype` into another bean with a longer-lived scope such as a `singleton`.*** we will briefly discuss relevant bean scopes.

Below are various scopes provided by the Spring framework :

- **singleton** — Only one instance of the bean is created per ApplicationContext. It lives and dies with ApplicationContext — thus, It provides the longest life span. This is the default scope and every Spring-managed bean has it unless another scope is provided.
- **prototype** — New bean instance is created every time a request for the specific bean is made. Thus it has a shorter lifecycle.

The below scopes are relevant only for web-aware Spring `ApplicationContext`

- **request** — A new instance of the bean is created for every HTTP request from a single bean definition.
- **session** — A new instance of the bean is created for an HTTP session.

Spring also provides **`globalSession`**, **`application`** and **`websocket`** scopes as well. 

we can use `@Scope` annotation to provide the scope to the bean. 

```java
@Scope("prototype")
public class Command {
...
}
```

For XML configuration, we have to add a `scope` attribute to the bean definition.

```java
<bean id="appCommand" class="com.initgrep.demos.Command" scope="prototype"/>
```

&nbsp;&nbsp;&nbsp;

Now that we have a little background of how Spring Bean Scopes work. Let's analyze the below code snippets 😎:

```java
@Component
@Scope("singleton") //default
public class CommandProcessor {

    @Autowired
    private Command command;

    public void processCommand() {
        command.run();
    }
}
```
*CommandProcessor.java*
{:.image-caption}

```java
@Component
@Scope("prototype")
public class Command {
    public void run(){
        System.out.println("Command Run for hashCode - "+this.hashCode());
    }
}
```
*Command.java*
{:.image-caption}

```java
@Component
public class ProcessorApplication{

	@Autowired
	CommandProcessor processor;

	@Override
	public void run()  {
		processor.processCommand();
		processor.processCommand();
		processor.processCommand();
		processor.processCommand();

	}
```
*ProcessorApplication.java*
{:.image-caption}

let's see what we have here —  

A Singleton Scoped Bean - `CommandProcessor` and  a Prototype Scoped Bean — `Command`.  The `CommandProcessor` bean  also has a dependency on `Command` Bean and invokes the `Command.run()` method.

We also have a singleton scoped bean — `ProcessorApplication` bean which invokes  `CommandProcessor.process()` method. 

In terms of the number of instances,  two singleton bean instances for `CommandProcessor`  and  `ProcessorApplication` are created . 

Since the `Command` bean has the prototype scope. I am assuming, we should have multiple instances of it.

If you run the above code, the output will be similar to the below. The hash code  of the `Command` bean instance returned is the same for all invocations of the `run()` method. That means, only one bean instance of `Command` is created even though it has the `prototype` scope. 

```
Command Run for hashCode - 1155862258
Command Run for hashCode - 1155862258
Command Run for hashCode - 1155862258
Command Run for hashCode - 1155862258
```

Wait 🤔— Shouldn't the prototype scope generate multiple instances since it is being called multiple times? The answer is No. 

Despite the fact, the dependency has a **Prototype** scope, the **Singleton** bean is created once and all of its dependencies are resolved at that time. Hence, even though  `Command` has a prototype scope, it would still have only one instance of it present in the `CommandProcessor` bean.

Now the obvious question here  is — ***what if I want to inject a prototype bean in a singleton but still want multiple instances to be created, much like prototypal behavior***? 

*Well, Spring framework provides multiple options to help with that. We will go through each one of them in detail below.*


&nbsp;
## Use `ApplicationContext` to get a new bean

With this option in place, we can use `ApplicationContext.getBean()` method to fetch a new instance of the bean.

That means we also have to give up on *Dependency injection* since we are manually asking for instances from `ApplicationContext`.

To implement this behavior, we will have to modify how `CommandProcessor` bean is getting the instance of the `Command` bean. I have listed the changes below —

- Remove the existing `@Autowire` `Command` bean.
- Implement `ApplicationContextAware` and implement the `setApplicationContext` method.
- Use `ApplicationContext.getBean`  method to fetch the Command instance.

```java
@Service
@Scope("singleton") //default
public class CommandProcessor implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    public void processCommand() {
        applicationContext.getBean(Command.class).run();
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
            this.applicationContext =  applicationContext;
    }
}
```

Test class for the same  will now produce different hash codes —

```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = { CommandProcessor.class, Command.class})
public class CommandProcessorTest {

    @Autowired
    CommandProcessor commandProcessor;

    @Test
    public void testCommandInstances(){
            commandProcessor.processCommand();
            commandProcessor.processCommand();
            commandProcessor.processCommand();
    }
}
```

&nbsp;
## Lookup Method Injection

As Explained in the Spring docs [here](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lookup-method-injection):

> *Lookup method injection is the ability of the container to override methods on container-managed beans and return the lookup result for another named bean in the container. The Spring Framework implements this method injection by using bytecode generation from the CGLIB library to dynamically generate a subclass that overrides the method*

There are a few conditions, we need to follow, before implementing this design:

- Method to be overridden and the Bean to be sub-classed should not be `final`.
- Lookup methods do not work with the factory method on `@Bean` configurations.

The Lookup method can be declared using both annotations as well as XML configuration.

&nbsp;
### Lookup method injection with annotations

We can use either an abstract class or a concrete class to implement Lookup method injection.

&nbsp;
**Concrete Class Implementation**

Here `@Lookup` annotation defines `getCommand` method to be lookup method.

```java
@Service
@Scope("singleton") //default
public class CommandProcessor {

    public void processCommand() {
        getCommand().run();
    }

    @Lookup
    public Command getCommand(){
        return null;
    }

}
```

**Abstract Class Implementation**

Since the Container creates the dynamic subclass of the Bean with the lookup method. It is ideal to have an `abstract` class with an `abstract` lookup method.

> For unit tests, we will have to manually create the concrete stubs.


```java
@Service
@Scope("singleton") //default
public abstract class CommandProcessor {

    public void processCommand() {  
        getCommand().run();
    }

    @Lookup
    public abstract Command getCommand();

}
```

&nbsp;
### Lookup Method Injection with XML configuration

In XML configuration, `<lookup-method>` element is used to define the lookup method. Similar to the annotations, the Look method can be either a **concrete or an abstract** method. Either way, the Spring Container will subclass it.

```xml
<!-- a stateful bean deployed as a prototype (non-singleton) -->
<bean id="command" class="com.initgrep.demos.Command" scope="prototype">
    <!-- inject dependencies here as required -->
</bean>

<bean id="commandProcessor" class="com.initgrep.demos.CommandProcessor">
    <lookup-method name="getCommand" bean="command"/>
</bean>
```

&nbsp;
## ObjectFactory<MyTargetBean> to get the instances

`ObjectFactory` interface defines a generic factory that returns a new instance for some target object on each invocation. The target bean should be of `prototype` scope.  

The injection point can be declared as the `constructor` or `setter` argument or `autowired` field.

`ObjectFactory<T>.getObject()` method is used to get the instance of the target object.

```java
@Service
@Scope("singleton") //default
public class CommandProcessor {

    @Autowired
    ObjectFactory<Command> objectFactory;

    public void processCommand() {
        objectFactory.getObject().run();
    }

}
```

&nbsp;
## **XML configuration to generate a scoped proxy**

### AOP **Scoped Proxies**

It enables Spring IOC container to create a proxy instead of of the actual object. The proxy has the same interface as the actual object.

If Scoped Proxies are used for a `prototype` scoped bean, every method call to the shared proxy results in creation of a new instance of the bean.

```xml
<bean id="command" class="com.initgrep.demos.Command" scope="prototype">
    <!-- instructs the container to proxy the surrounding bean -->
    <aop:scoped-proxy/> 
</bean>
```

The above Bean  definition contains the `<aop:scoped-proxy/>` element that instructs the Spring IOC container to create a proxy for this `Command` bean. 

Following is the complete example —

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- an prototype-scoped bean exposed as a proxy -->
    <bean id="command" class="com.initgrep.demos.Command" scope="prototype">
        <!-- instructs the container to proxy the surrounding bean -->
        <aop:scoped-proxy/> 
    </bean>

    <!-- a singleton-scoped bean injected with a proxy to the above bean -->
    <bean id="commandProcessor" class="com.initgrep.demos.CommandProcessor">
        <!-- a reference to the proxied command bean -->
        <property name="command" ref="command"/>
    </bean>
</beans>
```