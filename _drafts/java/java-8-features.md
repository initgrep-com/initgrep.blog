

#### Lambda expression.

Lambda expressions were introduced as a move towards functional programming. Java has traditionally bean an object oriented language. While it serves the purpose for most of the use-cases, functional programming has its own advantages such as lazy evaluation, Memoization etc.

Lambda expression takes over the anonymous class approach and replaces it with a function style approach. It encapsulates a single unit of behavior and passes it to other code. 

`A single unit of behavior` in its simple terms means a unit of code, ideally a type, which only performs one function. This function is predictable by its type and it does not change. For example, an interface with a  single method -- Functional Interface or single abstract method interface(SAM).

Let me take the case of `Comparator` interface. Since it has a single abstract method. It is an ideal case to use Lambda expressions.

Below is an example of how we can use a `Comparator` Interface to sort a list of `User` objects.
You can copy the below code to create an exact copy in your Development Environment.

** User.java **
```java
public class User {
	
	private String name;
	private Integer age;
	
	public User(String name, Integer age) {
		super();
		this.name = name;
		this.age = age;
        //getters and setters
        //toString
	}
}
```

**UserService.java**

```java
public class UserService {
      /**
       * 
       * @param users list of users
       * @param ct the Comparator object
       * @return list of Users sorted based on the comparator object
       */
      public List<User> getOrderedUsersUsingAnonymousComparator(List<User> users, Comparator<User> ct){
          users.sort(ct);
          return users;
      }
}
```

**App.java**

```java
public class App 
{
    public static void main( String[] args )
    {
    	/** call the service method **/
        
        new UserService().getOrderedUsersUsingAnonymousComparator(users, new Comparator<User>() {
          @Override
          public int compare(User o1, User o2) {
              //  comparator condition to sort
              return o1.getAge() - o2.getAge();
          }
		});
    }
 }
```

To avoid the Anonymous class declaration for a single abstract method interface, we can use the lambda expression as below:

```java

public class App 
{
    public static void main( String[] args )
    {
    	  new UserService().getOrderedUsersUsingAnonymousComparator(users,
          		(u1, u2)->u1.getAge() - u2.getAge());
                
          /** OR **/
          
            new UserService().getOrderedUsersUsingAnonymousComparator(users, (u1, u2)->{
            	//further business logic can be written here
                return u1.getAge() - u2.getAge();
             });
    }
```
