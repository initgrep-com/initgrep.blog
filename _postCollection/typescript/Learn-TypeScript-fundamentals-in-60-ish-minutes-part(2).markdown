---
layout: seriesPost
bannercolor: "blue darken-5"
title:  "Learn TypeScript fundamentals in 60-ish minutes - part(2) "
date:   2018-11-02
meta: "TypeScript is the superset of JavaScript with optional static types. It compiles to JavaScript. It is designed for the development of large applications. "
excerpt: "TypeScript is the superset of JavaScript with optional static types. It compiles to JavaScript."
category: typescript
comments: true
author: "sheikh irshad"
twitter: imshykh
facebook: irshsheikh
github: igagrock
image: ts.jpeg
categories:
  - typescript
  - javascript
  - all

---

This post is in continuation with the [previous](/posts/typescript/Learn-TypeScript-fundamentals-in-60-ish-minutes-part(1)) post. If you have directly landed here, I would suggest you read the previous post first.

          
#### Classes

TypeScript uses the object-oriented approach to handle the creation of objects and inheritance. Typescript classes are essentially compiled to the given JavaScript version which allows greater browser compatibility. ES6(ECMAScript-2015) also includes a similar approach. 

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

      


##### Inheritance and Access Modifiers

A class can extend to other classes and thus Inherit all the `protected`
and `public` members of the class. `private` members are not inherited.
Each member is `public` by default. 
Methods also follow a similar rule as the members.

> Constructor can be marked as `protected` which means the class can only be instantiated and is accessible within the class declaration. However, it can be extended by other classes.


> If a constructor is declared `private`, the corresponding class cannot be extended to and is only accessible within the class declaration.


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
           /** super has to be the first statement in the 
               constructor of the deriving class 
            **/
           super(name,age); 
         }
         introduce(){
           /** call the method of the parent class **/  
           super.introduce();  

          /**ERROR: name is a private memeber of parent class **/   
          console.log(`HI my name is ${this.name}`); 

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


{% include ads/article-ads.html %}
        
##### ReadOnly modifier and Parameter properties

Declaring a member as `readonly` cannot be modified except in constructor or at the place of declaration using parameter properties.

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


                          


##### Accessors: Getters and Setters

TypeScript supports `getters`/`setters` as a way of intercepting access to a member of an object. `Get` and `Set` keywords are used to provide the same. TypeScript compilers lower the ECMAScript 5 does not support this feature.

```js
   /**
    Declare a class Employee with a private member username.
    set getters and setters for the member.
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



##### Static Properties

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


                      

##### Abstract class

`Abstract` keyword is used to declare a class as abstract. An abstract class can not be instantiated. It can be inherited by other classes. Methods declared as `abstract` only have the method declaration. However, non-abstract methods can also be present.

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


&nbsp;
{% include ads/article-ads.html %}
&nbsp;

#### Generics
Generics is a facility of generic programming to produce reusable software components.
> Generic programming is a style of computer programming in which algorithms are written in terms of types **to-be-specified-later** that are then instantiated when needed for specific types provided as parameters-- [wikipedia](https://en.wikipedia.org/wiki/Generic_programming)

A generic type could be represented by any character, commonly represented by any Capital letter such as **`T`**. 

##### Generic Functions
When used in a function, TypeScript compiler will enforce correct use of the generic types inside the function. A typical Generic function in TypeScript is written as follows:

```js
    /** generic function to declare a variable of various types */
    function declareVariable<T>(parameter: T):T{
        return parameter;
    }
    /** declare type as number as number **/
    let x =  declareVariable<number>(12);

    /**ERROR:  Type '"a dummy sring"' is not assignable to type 'number'. **/
    x = "a dummy string "

    /** declare type as number as string **/
    let yx = declareVariable<string>("iota");
    
```

A generic type typically represents an identity(type) of the Type. *It does not control the structure of the parameters.*

The below example clears a little bit air about it. We have declared a function with generic type **`T`**. If we try to access the `length` property, the TypeScript compiler is going to complain about it. 

```js
    /** Declare a function with generic type T
        and try to access the length property 
    **/
    function declareVariable<T>(parameter: T):T{
        /** ERROR": Property 'length' does not exist on type 'T' */
        console.log(parameter.length) 
        return parameter;
    }
```

Let's take a step back and think-- if our generic function is dealing the types having a `length` property, then our declaration of parameters is wrong. Typically, indexable types such as  `array` have a length property. It does not necessarily have to be an `array`. It could be any type with a `length` property.

Let's change the parameter type of the function.

```js
    /** Parameter includes an array of T type **/
    function processIndexableGenericTypes<T>(params:Array<T>):T{
        console.log(`length = ${params.length}`);
        return params[0]
    }

    var firstElement = processIndexableGenericTypes<number>([1,2,3,4]);

```
we could use a user-defined type as below
```js
    /** lengthPropType has a property length:number */
    interface lengthPropType{
        length: number;
    }

    /** Parameter includes an array of T type **/
        function processIndexableGenericTypes<T>(params:lengthPropType):T{
            console.log(`length = ${params.length}`);
            return params[0]
        }

        /**
         * Since the array has a length property.
         * the below statement will still work with array parameter 
         */
        var firstElement = processIndexableGenericTypes<number>([1,2,3,4]);
```



{% include ads/article-ads.html %}

##### Generic Function Types
Generic function types are created as a typical function type except the explicit type name is replaced with a generic type.

```js
    /** represents a function with parameter of any given type */
    var genType : <T>(param:T)=>T;

    /** assign a function of similar type */
    genType =  declareVariable;
    declareVariable(1212);

    /** declare a type of a function with array parameters of a type T */
    var indexgenType : <T>(params: T[]) =>T;
    indexgenType = processIndexableGenericTypes;
    indexgenType([1,2,3]);
```

##### Generic Interface
The below example describes a generic interface

```js
    /** declare an interface which specifies
        a function type 
    **/
    interface genFunctionType<T,U>{
        <T,U>(param1:T,param2:U): T;
    }

    function logOuput<T,U>(a: T, b:U):T{
        console.log(a,b);
        return a;
    }

    var logNumStringOutPut : genFunctionType<number, string> =  logOuput;
    logNumStringOutPut(12, "dashing");
```

##### Generic constraints 
Normally, Generic types can allow any predefined and user-defined types. To have limits on what a generic type can represent, constraints come in picture. The `extends` keyword is used to constrain a generic type.

The following example will provide a better picture of constraint usage.

* Let's say we want a function to accept only those types of parameters which have a `name` property of type `string`. 
```js
     /** declare a type which has a name:string property **/
    interface nameType{
        value:string;
    }
    /**getName function excepts parameters which extend to nameType **/
    function getName<T extends nameType>(nameobj:T){
      console.log(nameobj.value);
    }

    getName({value:"Batis"}); //OUTPUT: Batis
```

* How about making things a little complex-- Let's say we want to create a class `Person`. It can take any types as parameters which have `name` and `age` property. Also, it wants to make sure the `name` is of the type which has at least a `value` property of type `string` and `age` is of a type which has at least a `value` of the property of type `number`

```js
    /** ageType has a property value:number */
    interface ageType {
        value: number;
    }
    /** nameType has a prperty value:age*/
    interface nameType {
        value: string;
    }

    /** declare an interface with T which has a property T and U.
       Both T and U extend to nameType and ageType respectively.
     */
    interface PersonType<T extends nameType, U extends ageType> {
        name: T;
        age: U;
    }

    /** Person class takes type P which extends 
        to PersonType Interface 
     **/
    class Person<T extends PersonType<{ value: string }, { value: number } >> {
        name: string;
        age: number;
        constructor(param: T) {
            this.name = param.name.value;
            this.age = param.age.value;
        }
    }

    let personOne = new Person({ name: { value: 'batis' }, age: { value: 31 } });
```

##### Class Types In Generics

It is essentially useful when creating factories to generate classes which `extends` from a certain type. A slight twist here is-- the factory function will take constructor signature as the parameter type.

```js
/**function type of class based generic factory**/ 
var genericFactoryType : <T extends Entity>(param: new ()=>T) =>T;
````

`new ()=>T` represents a constructor signature with no arguments and returning a generic type.

The implementation looks as below--

```js
    class Entity{
        name:string;
    }

    class Student extends Entity{
        GPA:number;
    }
    class PrimeryGrader extends Student{
        GRADE: string;
    }

    class Professor extends Entity{
        Band: number;
    }

    class UniversityPropessor extends Professor{
        Department:string;
    }

    /** factory function takes a constructor type parameters
        of type E which extends to Entity
    **/
    function createEntity<E extends Entity>(e : new ()=>E):E{
        return new e();
    }

    var student = createEntity<Student>(PrimeryGrader);
    var professor = createEntity<Professor>(UniversityPropessor);

```

#### Type Compatibility
TypeScript uses structural typing for comparison of the types unlike [nominal typing](https://en.wikipedia.org/wiki/Nominal_type_system) using by object-oriented languages.

> ##### Type `X` is compatible with type `Y` if `Y` has at least same members as `X`

```js
    interface X{
        a:number;
        b:number;
    }
    interface Y{
        a:number;
    }
    let x:X;
    let y:Y;

    y = x; //OK
  
    /** 
        ERROR: Type 'Y' is not assignable to type 'X'.
        Property 'b' is missing in type 'Y'.
    **/
    x = y;

```

> ##### Function type `X` is compatible with function type `Y` if the `Y` has at most or less number of parameters( of the same type) than `X` and the return type of `Y` is either same or a subtype of return of `X` 

```js
    let X : (a:number, b:number) => number;
    let Y :(a:number ) => number;
    X = Y  //OK
    /**
     ERROR: Type '(a: number, b: number) => number' is not assignable 
     to type '(a: number) => number'.
     **/
    Y = X;
```

**Optional Parameters** hold an optional place in comparison also. If the types are not compatible, optional parameters can pitch in and satisfy the compatibility-- given if they are of same types. Let's take the above example and add an optional parameter `b` to type `Y`

```js
let X : (a:number, b:number) => number;
// b is an optional parameter
let Y :(a:number , b?:number) => number; 

x=y  //OK
y=x  //ok
```

If we remove the parameter `b` from type, `X` and `Y` being compatible would still hold true.

**Rest Parameters** are considered an infinite series of optional parameters.

**Overloaded Function** each overload in the source type must be matched by a compatible signature on the target type. 

**Class Compatibility**. Since constructor and static side of the class are not considered, It is similar to comparing interface types. However `private` and `protected` affect the compatibility. Target type should have equal numbers of `private` or `protected` members as the source.

