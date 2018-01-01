---
layout: seriesPost
bannercolor: "purple darken-4"
title:  "Groovy : simplifying SAM type as closures"
date:   2016-10-31
meta: "A SAM type is a type which defines a single abstract method. It includes functional interfaces and Abstract classes with single abstract method"
excerpt: "A SAM type is a type which defines a single abstract method. It includes functional interfaces and Abstract classes with single abstract method"
category: groovy
comments: true
author: "sheikh irshad"
twitter: imshykh	
facebook: irshsheikh
github: igagrock
image: sam.jpg
---

> A SAM type is a type which defines a `single abstract method`. It includes `functional interfaces` and `Abstract classes with single abstract method` .

### Functional interface:
An Interface which permits only single Abstract method excluding the default methods. Functional Interface was introduced in Java 8. For compile time validations, [`@FunctionalInterface`](https://docs.oracle.com/javase/8/docs/api/java/lang/FunctionalInterface.html) was introduced.

```groovy
        interface Predicate<T> {
            boolean test(T obj)
        }
```
#### Abstract classes with single abstract method:
```groovy
public class predicateImpl  implements predicate<String>{
      @override
      boolean test(String obj){
       return obj.contains('G')
      }
}
```
Groovy closures are very powerful. They can be coerced to a ` AST` using `as` operator. Since  `version 2.2.0` , `as ` operator is optional.

```groovy
@param source the list
@param predicate the functional interface
public <T> List<T> collect(List<T> source, Predicate<T> predicate) {
    source.findAll { predicate.test(it) }
}
```
The above use case might seem alien at first. But once we go through a few examples, it would be clear that it is the most common use case used in most operations in groovy. Implementing such a use case in groovy would be like

```groovy
    collect(['Java','Groovy'], { it.contains 'G'} as Predicate) -(1)
    //or 
    collect(['Java','Groovy'], { it.contains 'G }) // version 2.2.0 -(2)
```

In the `(2)nd` case , the 2nd parameter is closure and it is coerced to an AST. so we can use the closure syntax for the method calls i.e. put the closure outside of the parenthesis which improves the readability of code and simplifies the syntax

```groovy
collect(['Java','Groovy']) { it.contains 'G }
```
looking closely to the above code, It is same syntax used for the collect method for collections such as 

`[1,2,3,4,5].collect([]){ it*it }`


