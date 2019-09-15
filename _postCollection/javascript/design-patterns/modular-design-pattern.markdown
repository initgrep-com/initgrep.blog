---
layout: seriesPost
bannercolor: "yellow darken-4"
title:  "Modular design pattern in JavaScript"
date:   2018-03-18
meta: "Modular design pattern helps to split each functionality into different chunks of code to separate the concerns."
excerpt: "Modular design pattern helps to split each functionality into different chunks of code to separate the concerns."
category: Design-pattern
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: igagrock
image: mod.jpg
categories:
  - Design-pattern
  - javascript
  - all
---

JavaScript is an object-based language. During the development of an application, it is important to keep the code clean and avoid name-space collisions. In order to keep the code modular, it is important to split each functionality into different chunks of code to separate the concerns. It helps in efficient development, future maintainability, debugging and testing.

Modularity is used in almost any JavaScript libraries/ frameworks such as nodeJs, jQuery etc. Each module is kept in a separate file to have a complete distinguishing file system to traverse and maintain.

Let's go through the basics of implementation and learn how we can leverage the pattern for the specific needs. For this tutorial, Let's create some functionalities of a calculator as our demo `finance app`.
 
**Modular design pattern in making**

The basic way to create different modules is to have separate name-space for a set of functions to avoid name collisions in the application. In JavaScript, we can create a separate object with a set of functions to achieve this.

```js

var calc = function(){
    this.add = function(a,b){return a+b;}
    this.subtract = function(a,b){return a-b;}
    this.divide = function(a,b){return a/b;}
    this.multiply = function(a,b){return a*b;}
 }
```

I have created a constructor function to create the `calc` object. This object can be initialized in any part of the application to access the methods. Let us say, we want to use the above `calc` in a `finance` application


```js
var financeCalc = new calc();
    financeCalc.add(100 , 200);
    financeCalc.subtract(400 , 100);
```

let's assume, we need an extra function which adds data of two different months. For this, we will create another module as `grossModule` and keep the new function as part of it.

For further upgrades, we can follow the same process of creating a new object and adding the respective methods.

```js
var grossModule = function(){
      this.add = function(month1Data , month2Data){
           //    doing some complex calculations
         return month1Data + month2Data
      }
}
// using this module in our finance application 
 var financeCalc = new calc();
    financeCalc.add(100 , 200);
    financeCalc.subtract(400 , 100);
    
 var financeGrossModule = new grossModule();
       financeGrossModule.add(month1, month2);
```
we have assigned different name-space for each of the `add` methods.
we can use both the types of `add` methods in the same application without any challenges.

So far so good. let's go further ahead and discuss some benefits of implementing the modular pattern in JavaScript.

{% include ads/article-ads.html %}

 **Encapsulation**:
 
 Encapsulation in its simple terms means, *show only the functionality which is necessary and keep the rest of it hidden or private*. Encapsulation is a popular concept in the various object-oriented languages such as Java. Similarly, we can achieve it in JavaScript also by keeping in mind a few principles such as:
  1. *Access the data using methods (getter/setter)*
2. *Keep the methods private which deal with inner business logic*
3. *Create simple public API's*
      
This is just a specification of how to implement encapsulation and does not refer to any standard document. 
    
Let's modify the `calc` module while considering each of the above features.
   
```js
var calc = function(){
       //private member functions
       var roundingLimit = 2;
       var add = function(a,b){return a+b;}
       var subtract = function(a,b){return a-b;}
       var divide = function(a,b){return a/b;}
       var multiply = function(a,b){return a*b;}
       
       //public methods
       this.getRoundingLimit = {return roundingLimit;}
       this.calculate = function(operation , a, b){
           switch(operation){
              case '+': return add(a ,b); break;
              case '-' : return subtract(a,b); break;
              case '*' : return multiply(a,b); break;
              case '/' : return division(a,b); break;
              default : alert("no suitable operation found") break;
           }
       }    
 }
 
```
  Our `Calc` module now has one public method `calculate` which takes the sign of operation and returns the result. Rest of the methods are private and can not be accessed outside the module.

```js
var financeCalc = new calc();
     financeCalc.calculate('+',100,200);
        financeCalc.calculate('-',200,100);
     financeCalc.add(100,200); // is undefined
     financeCalc.roundingLimit; //undefined
     financeCalc.getRoundingLimit(); // 2
```
{% include ads/article-ads.html %}

**Introduction to IIFEs**

  Immediately Invoked Function Expressions or IIFE  (pronounced "iffy") are anonymous JavaScript functions which are invoked immediately. A basic syntax is like:
  
```js
    (function () {
        // logic here
    })();    
```
 In JavaScript, functions can either be created using a normal function declaration such as the named function **or** a function expression
```js 
//named function declaration
function foo() {//some code here}
    
// function expression
var foo = function() { //some code here }    
```
Expressions always return a value. Since functions are first class objects in JavaScript, If we create a function using function expression, it would return the function object.

Let's take the below example:

```js
  //declare the function
  var foo = function(){
  
  }
  //invoke the function
  foo();
  ```
we can also write the above as 

```js
  var foo = (function(){})
  foo();
```
when we wrap the function in a set of braces, it returns the expression value which is a function object. It also means we can invoke the function object returned from the expression. It can be done by merely adding the calling parenthesis.
```js
(function(){
    //code here
})();
```
{% include ads/article-ads.html %}
**Advantages of using IIFEs to implement a modular pattern**

If you noticed above, when we created our `calc` module. To use it in our `finance` application, we had to manually create the objects. we named it as `financeCalc`. The name looks fine but it is not defined by the module and is not a standard. It is possible to give any random name and eventually fall into a name collision. So how can we restrict it and give a standard name?. Well, IIFEs have come to our rescue. If you remember, IIFE is invoked at the time of creation. As a result, we can bet, we will always have one instance in our application with a standard object returned by the module itself. 

Let's assume, our `calc` module is present in a seperate file named as `calc.js`

```js
//calc.js
(function(){
       //private member functions
       var roundingLimit = 2;
       var add = function(a,b){return a+b;}
       var subtract = function(a,b){return a-b;}
       var divide = function(a,b){return a/b;}
       var multiply = function(a,b){return a*b;}
       var getRoundingLimit = {return roundingLimit;}
       var calculate = function(operation , a, b){
           switch(operation){
              case '+': return add(a ,b); break;
              case '-' : return subtract(a,b); break;
              case '*' : return multiply(a,b); break;
              case '/' : return division(a,b); break;
              default : alert("no suitable operation found") break;
           }
       } 
       
       //return the public resources with a standard object name-space
       return Calculator = {
               //public methods
            //Note: we can keep different names to the methods
             getRoundingLimit : getRoundingLimit,
             calculate : calculate
       }
       
 })();
 
```
We can import it by adding a `script` tag in our index html file or using any other module loading libraries. I will explain the various ways of loading modules by the end of this tutorial.

After importing the `calc.js` in our `financeApp`. Below is our demo `financeApp.js`. In our `financeApp.html`, we have added the `calc.js`. Once the Html is loaded, `calc.js` is also loaded and the IIFE is invoked. Thus, we will have the `Calculator` object available at the load time including the public methods present in the `Calculator`.

```html
  <script src ='calc.js' /> 
```

```js

 // financeApp.js
 Calculator.calculate('+',100,200);
 Calculator.calculate('-',200,100);
 Calculator.add(100,200); // is undefined
 Calculator.roundingLimit; //undefined
 Calculator.getRoundingLimit(); // 2
```

By now, I hope it is clear, how can we implement the modular design pattern in JavaScript applications. 

There are numerous libraries available today, which help to achieve the modular design pattern. Following are the few popular methods which are implemented:

1. [AMD *define* and *require * statement.](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)
2. [ CommonJS *require()* statement as implemented in nodeJs](https://nodejs.org/docs/latest/api/modules.html)
3. [  ES2015 *import* statement.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

You can check out the documentation for implementing each one of them. All of these libraries have various benefits such as lazy loading, asynchronous module loading, using modules in a non-html application etc.

 

