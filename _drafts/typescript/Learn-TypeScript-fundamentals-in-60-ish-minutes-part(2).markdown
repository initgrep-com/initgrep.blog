---
layout: post
bannercolor: "red darken-4"
title:  "Learn TypeScript fundamentals in 60-ish minutes - part(2) "
date:   2018-11-01
meta: "TypeScript is the superset of JavaScript with optional static types. It compiles to JavaScript. It is designed for the development of large applications. It may be used to develop applications for both client-side and server-side."
excerpt: "TypeScript is the superset of JavaScript with optional static types. It compiles to JavaScript. It is designed for the development of large applications. It may be used to develop applications for both client-side and server-side."
category: typescript
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: igagrock
image: ts.jpeg

---

> If you have followed the first tutorial in this series.. Great to see you back!
> In case, you have landed directly to this page, I would suggest to go through the previous part of this tutorial.

          
#### Classes

TypeScript uses the object-oriented approach to handle the creation of objects and inheritance. Typescript classes are essentially compiled to the given JavaScript version which allows greater browser compatibility. ES6(ECMAScript-2015) also includes the similar approach. 

```js
    /**
        A Person class is declared.
        name:string is a memeber variable
        introduce() is a method
    **/
    class Person {
      name:string;
      constructor(name:string){
        this.name = name;
      }
      introduce(){
        console.log(`HI my name is ${name}`);
      }

    }

    /**
        create sam as an Object of type Person
    **/

    var sam:Person = new Person("sam");
    sam.introduce();  // Hi my name is sam

```

      


#### Inheritance and Access Modifiers

A class can extend to other classes and thus Inherit all the `protected`
and `public` members of the class. `private` members are not inherited.
Each member is `public` by default. 
Methods also follow the similar rule as the members.

> Constructor can be marked as `protected` which means the class can only be instantiated  accessible within the class declaration. However, it can be extended by other classes.


> If a constructor is declared `private`, the corresponding class can not be extended to and is only accessible within the class declaration.


The below example is self-explanatory.

```js

    class Person {
      private name:string;
      protected age:number;
      constructor(name:string, age:number){
        this.name = name;
        this.age = age;
      }
      introduce(){
        console.log(`HI my name is ${this.name}`);
      }

    }
	
    /** Student inherits all public and protected members 
    	from class Person 
    **/
    class Student extends Person {
         public grade:string;
         constructor(name:string , age:number, grade:string){
           /** super has to be first statement in the 
               constructor of the deriving class 
            **/
           super(name,age); 
         }
         introduce(){
           /** call the method of the parent class **/  
           super.introduce();  

          /**ERROR: name is a private memeber of parent class **/   
          console.log(`HI my name is ${this.name}`); /

          /** age can be accessed here as it is a protected member */
          console.log(`My age is ${this.age}`); 

          console.log(`My grade is ${this.grade}`);
         }

    }
        /** declare x as person **/
        var x = new Person("x",12);
        x.introduce();

        /** declare a variable jack of the type Person 
            representing a Student  
        **/
        var jack:Person =  new Student("jack", 24, "A");
        student.introduce();

```


                  

#### ReadOnly modifier and Parameter properties

Declaring a member as `readonly` can not be modified except in constructor or at the place of declaration using parameter properties.

```js

	 /**declare using paramter properties */
    class ReadonlyType{
      readonly name:string = 'james';
    }

    /** use a constructor to initailize */
    class ReadonlyTypeWithConstructor{
      readonly name:string;
      constructor(name:string){
        this.name = name;
      }
    }

```


                          


#### Accessors: Getters and Setters

TypeScript supports getters/setters as a way of intercepting accesses to a member of an object.`Get` and `Set` keywords are used to provide the same. TypeScript compilers lower the ECMAScript 5 does not support this feature.

```js
   /**
    Declare a class Employee with a private member username.
    set getters and setters for the memeber.
    **/
    class Employee{
        private username:string;
        constructor(theUsername:string){
          this.username = theUsername;
        }
        get userName(){
          return this.username;
        }
        set userName(name:string){
          this.username = name;
        }


    }


    var jack = new Employee('Jack');
    /**setter called**/
    jack.userName = "emanuel";

    /** getter called **/
    var uName = jack.userName;
```



#### Static Properties

Static properties are available to class itself rather than on the instances.
`static` keyword is used to declare a property as static.

```js

class Printer{
  /** static method **/  
  static printDocument(path:string){
    console.log("document is printed");
  }
}

/** call the static method using the class name **/
Printer.printDocument("path://to/the/document");
```


                      

#### Abstract class

`Abstract` keyword is used to declare a class as abstract. An abstract class can not be instantiated. It can be inherited by other classed. Methods declared as `abstract` only have the method declaration. However, non-abstract methods can also be present.

```js

    abstract class Person{

       private name:string;
       constructor(name:string){
         this.name = name;
       }
      printName(){
        console.log(`hey yo.. I m ${this.name}`);
      }
      abstract printAge(age:number);
    }

    class realPerson extends Person{
      constructor(name:string){super(name);}
      printAge(age:number){
        console.log(`I am ${age} years old`);
      }
    }

    /** Cannot create an instance of an abstract class. */
    var p = new Person();

    var rp:Person = new realPerson("sparrow");
    rp.printAge(12);

```

#### Generics

Generics is a facility of generic programming to produce reusable code. A typical Generic function in TypeScript is written as follows:

```js

	
```