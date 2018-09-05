---
layout: post
bannercolor: "red darken-4"
title:  "Learn TypeScript fundamentals in 60-ish minutes "
date:   2018-06-26
meta: "TypeScript is the superset of JavaScript with optional static types. It compiles to JavaScript. It is designed for the development of large applications. It may be used to develop applications for both client-side and server-side."
excerpt: "TypeScript is the superset of JavaScript with optional static types. It compiles to JavaScript. It is designed for the development of large applications. It may be used to develop applications for both client-side and server-side."
category: typescript
comments: false
author: "sheikh irshad"
twitter: imshykh	
facebook: irshsheikh
github: igagrock


---

JavaScript is great! It supports dynamic types. However, scaling large applications written in JavaScript often becomes difficult.

TypeScript is the superset of JavaScript with optional static types. It compiles to JavaScript. It is designed for the development of large applications. It may be used to develop applications for both client-side and server-side.

The static types provided are similar to popular statically typed languages such as C++, C#, Java etc. If you are familiar with any of these languages then you might know how the type checking works during compilation. The static type checks also comes with extra lines and leads to verbose coding.

Well, If you are the fan of static types, let's dig in..

#### Basic Types:
Boolean, Number, String, Array, Tuple, Enum, Any, Void, Null and Undefined, Never, Object, 
Syntax:
```js
    let variableName:type
    //or inline initialization
    let variableName:type = value;
```
A few examples below will help you understand the declaration of the variables of various basic types.
```js
    //Boolean
    let isExpired:Boolean = false;
    //Number:
    let  productCount:Number;
    //String
    let  productName:String = 'detone';
    //Template string can also be used as
    let country:String = 'China';
    let productDetails:String = `Country of origin ${country}`;
    //Array
    let productSizesInInches:number[] = [12,24,34]
    //Array can also be written as
    let prodcutSizesInInches:Array<number> = [12,24,34]
```
**Tuple**: Tuple is an array where the types are already known. The types do not need to be same.
```js
	/*declare an tuple which has items as number, number,
	 number ,string, and array of numbers*/
	let preDefinedTypeTuple:[number, number, string, number[]];
	preDefinedTypeTuple = [1,1,'1',[1,2,3,4]]

	preDefinedTypeTuple = [1,"asd","1",[1,1,1,1]] //error
 ```
**Enum**: Enum is a way of giving names to sets of numeric values. By default, Numeric values start with **0**(Zero). However, it can be preset to any specific value and following values would be an increment of **1**(One). It is also possible to provide manual values to all fields.
> Name of an enum value can also be looked up by its value

```js
    //Default Declaration:
    enum Cities {Berlin , Beijing , California, London }
    //usage:
    let c:Cities = Cities.Beijing; // value would be 1

    // Declaration with Initial Preset value:
    enum Cities {Berlin =1 , Beijing , California, London }
    c = Cities.Beijing; //value would be two

    // Declaration with manual values:
    enum Cities {Berlin =1 , Beijing =10 , California = 12, London = 0 }
    c = Cities.Beijing; //value would be 10

    //find name using the numeric value
    let cityName:string = Cities[10]; //Beijing
```
**Any**: When the type is unknown or partially known, `Any` can be used.
It is way of opting-out of type checking.

```js
    let foo:any = 14; // May be a number
    foo = 'bar' //may be a string
    foo = false // may be a boolean
    foo.callMe(); // may be a object with callMe() method
```
**Void**: Void is absence of having a type. It is mostly used as a return type for the functions which does not return anything. If a variable has type Void, It can only be assigned `Null` or `undefined`.

**Null** and **undefined** are subtypes of all other types and can be assigned in place of any type. 

**Never**: When type of the value never occurs, It can be represented by `Never` such as a function which throws an exception and will never return a value.

```js
  function foo():never{
      throw new error("error message");
  }
```
**Object**:object is a type that represents the non-primitive type, i.e. any thing that is not `number, string, boolean, symbol, null, or undefined`.

**Type Assertion**: It is basically type casting. It is useful when developer is sure that this particular variable is of a specific type and compiler is not able to infer the type.

```js
    // Declare an array of any type
    let items:any = ["item1","item2","item3"]
    //cast to an array of string
    let itemSize:number = (<Array<string>>items).length

    let name:any = "Dolce";
    // cast to a string
    let len:number = (<string>name).length;
```
