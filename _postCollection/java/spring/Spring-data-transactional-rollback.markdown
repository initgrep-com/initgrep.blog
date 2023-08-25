---
layout: post
bannercolor: "blue dark-2"
title:  "@Transactional Rollback options in Spring Data"
date:   2021-08-24
meta: "@Transactional provides rollbackOn and noRollbackOn options to control the rollback for exceptions"
excerpt: "@Transactional provides rollbackOn and noRollbackOn options to control the rollback for exceptions"
category: spring
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: irshsheik
image: /assets/images/rollback.jpeg
categories:
    - spring
    - java
    - all

---

Transactions manage the changes that are performed in a system. The main purpose of transactions is to provide [ACID](https://en.wikipedia.org/wiki/ACID) characteristics to guarantee data validity. 

Spring provides a consistent programming model for transactions. `@EnableTransactionManagement` is used to enable transaction management for the spring application. Spring boot enables it by default.

[`@Transactional`](https://docs.oracle.com/javaee/7/api/javax/transaction/Transactional.html) annotation is used to designate the transaction boundary. 

- If this annotation is provided on the class then all the methods of the class have transactions enabled.
- If no annotation is provided on the class, then the individual methods will require the explicit `@Transactional` annotation - if required.

`@Transactional` annotation provides various options to control the behavior of the transaction. We will only focus on two options that help in defining the rollback behavior of the transaction.

> The default behavior of the transactions is to rollback for the runtime exceptions and the errors. You wouldn't need to change the defaults in most of the scenarios. However, there are some cases, where you might care about whether the transaction should rollback or not.

Let's consider the below example —

```java

class ProductService{

	@Transactional
	public void processProducts(){
		
			saveAllProducts(...products); // saves the data in the database
			sendNotification();
	}

	/*
	* sendNotification throws an exception
	*/
	private void sendNotification() throws NotificationException{
		//sending the notification
	}

}
```

- `processProducts()` method supports the transaction.
- `saveAllProducts()` saves the product data in the database.
- `sendNotification()` sends the notification through some external system. It throws `NotificationException` for any failure.

This code will work just fine. The products will be saved and after that, the notifications will be sent. 

**However, if the external system is down and we are unable to send the notifications, `NotificationException` will happen and the transaction will rollback all the changes. This means, due to the notification failure, we are unable to save the products in the database.**

 
Now, if we want to save the data *irrespective of the notification
operation success or failure*. We would need to modify the default transaction rollback behavior. `@Transactional` annotation provides two options `dontRollbackOn` and `rollbackOn` for the same. 

&nbsp;
### dontRollbackOn

It takes a list of exceptions for which the transaction should not rollback.

&nbsp;
**Example : @Transactional on Class**

```java

@Transactional(dontRollbackOn = UserNotFoundException.class)
public class ExampleService{

}
```

Here — `@Transactional` annotation is specified on class. As a result, Rollback will not happen for `UserNotFoundException` and the same behavior will apply to any subclasses.

&nbsp;
**Example: @Transactional on method**

```java
class ExampleService{

		@Transactional(dontRollBackOn= { UserNotFoundException.class, DndException.class})
		public void saveExample(){
		
			//...
			throw new UserNotFoundException();

			throw new DndException();
		
			//...
			throw new DataNotValidException();
		}

}
```

Here `@Transactional` annotation is specified only on method. Rollback will not happen for `UserNotFoundException` and `DndException` if thrown within the enclosed method. Also, `DataNotValidException` will cause the transaction to rollback.

&nbsp;
**Example: @Transactional on both Class and Method**

```java
@Transactional
class ExampleService{

		@Transactional(dontRollBackOn=UserNotFoundException.class)
		public void saveExample(){
		
			//...
			throw new UserNotFoundException();
		
			//...
			throw new DataNotValidException();
		
				
		}

}
```

Notice, the `@Transactional` annotation is specified at both class and method. However, the `dontRollBackOn`  option is only specified on the method. Since the `@Transactional` at method level takes precedence. This means `UserNotFoundException` will not cause any rollback in this method.

&nbsp;
### rollbackOn

It takes a list of exceptions for which the transaction should  rollback.

```java
@Transactional(
dontRollbackOn = { UserNotFoundException.class, BadRequestException.class},
rollbackOn= {Exception.class}
)
public class ExampleService{

}
```

Here — the transaction will rollback on `Exception` or any sub-class of it. 

&nbsp;
**dontRollbackOn** takes precedence over **rollbackOn**

```java
@Transactional(
dontRollbackOn = { UserNotFoundException.class, BadRequestException.class},
rollbackOn= {BadRequestException.class}
)
public class ExampleService{

}
```

`BadRequestException` is specified for both options. Since `dontRollbackOn` option takes precedence over `rollbackOn`. `BadRequestException` will not cause any transaction rollback.