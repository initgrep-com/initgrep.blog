---
layout: seriesPost
bannercolor: "green darken-4"
title:  "Observer pattern in Javascript"
date:   2017-12-30
meta: "Observer design pattern helps to decouple the code dependency by registering  different Observers on the Subject"
excerpt: "Observer design pattern helps to decouple the code dependency by registering  different Observers on the Subject"
category: JavaScript
comments: true
author: "sheikh irshad"
twitter: imshykh	
facebook: irshsheikh
github: igagrock
image: observer.jpg
---




Design patterns are an important aspect of constructive and efficient software 
development. To create code maintainable and reduce dependency across the modules, it is important to implement the design patterns most suited for the use case.

My analogy of the **Observer pattern** could be given as below
>*Let's say, In my home, I have a main switch board.  we can either switch-on the main 
>board or switch-off. Every room has one light bulb. I want to create a pattern such as 
>when ever the board is turned off or on, The light bulbs in each room are turned on or 
>off. If we are implementing `Observer pattern` here, I would connect all the light 
>bulbs to the main switch board. So every time I switch-off or switch-on , the bulbs 
>either turn on or turn off*

![observer-analogy](/assets/images/observer.png)

I hope that was a clear analogy.

Now the question arises, when do we want a similar pattern in software development. 
Lets say I have a Data Structure(X). It could be  `Maps or Lists or trees etc`.  I have other functionalities that have to do some processing or house-keeping whenever the data in the Data Structure(X) changes. In order for me to do that, I could implement the `Observer pattern`. I would register all the dependent functionalities with the Data Structure(x) and create service(s) which notifies them whenever the data changes.

Let's get started by actually implementing one. Our Data Structure for this tutorial is a simple list named as `dataList`. Following steps would describe the implementation -

**Create an Object which wraps our data structure**

```js
   /**
    using an empty constructor function 
    so it would easier to create new objects of Subject
   **/
 var Subject =   function(){};
```

 **Add the data Structure to wrapper Object**


```js
  Subject.prototype = function(){
  	var dataList =  [];
   
	var push =  function( val ){
		dataList.push(val);
	};
	var pop =  function( val ){
		var index = dataList.indexOf(val);
		if(index > -1){
			dataList.splice(index,1);
		}
	};
    return{
		data : dataList ,
		push : push,
		pop : pop
	}
  }
```
we have added the `dataList` and helper functions (`push & pop`) to add and remove the data respectively. Nothing fancy till now.

**Add a List which keeps track of Observers**

```js
  Subject.prototype = function(){
  	var dataList =  [];
    //added the Observer List
    var observers =  [];
   
	var push =  function( val ){
		dataList.push(val);
	};
	var pop =  function( val ){
		var index = dataList.indexOf(val);
		if(index > -1){
			dataList.splice(index,1);
		}
	};
    return{
		data : dataList ,
		push : push,
		pop : pop
	}
  }();
```

**Register an Observer**

```js
var register = function ( observer){
   if(observer.notify && typeof observer.notify == 'function'){
	   observers.push(observer)
	}else{
	   console.error("can not register the observer. Notify method not present");
	}
};
```
`register` function takes an object as parameter and stores(registers) it in the `Observers` list. It is mandatory that this Object has a `notify` function. We have a validation in place for it. 
we will get back to the `notify` function later. let's forget it for now

**Remove an Observer**

if a particular Observer has registered. The `remove` function will remove the specific Observer.
```js
var remove =  function(observer){
	var id = observers.indexOf(observer);
	if(id > -1){
		observers.splice(id , 1);
	}
}
```

**RECAP**- *In case you are wondering what is going on :)*

1.  `Subject` is a wrapper object which contains our `dataList` and `Observers` list.
2.   Helper functions (`push/pop`) to add and remove data to/from `dataList`. 
3.   Service functions (`register/remove`) to register and remove `Observer` from Observer List

Below is the complete code template of what we have done so far.


```js
var Subject =   function(){};
Subject.prototype = function(){
	var dataList =  [];
	var observers =  [];
	//add the data to dataList
	var push =  function( val ){
		dataList.push(val);
	};
	var pop =  function( val ){
		var index = dataList.indexOf(val);
		if(index > -1){
			dataList.splice(index,1);
	}
	};
	var register = function ( observer){
		if(observer.notify && typeof observer.notify == 'function'){
			observers.push(observer)
		}
		else{
			console.error("can not register the observer. Notify method not present");
		}
	};
	var remove =  function(observer){
		var id = observers.indexOf(observer);
		if(id > -1){
			observers.splice(id , 1);
		}
	}
    /**
    * returning the Public functions
    **/
	return{
		push : push,
		pop : pop,
		addListener : register ,
		removeListener : remove
	}
}();
```

**Notify function** - *I told u, I will get back to it later ;)*
> when implementing a particular design pattern, we basically try to decouple different dependent modules. In order for this to work, their has to be a proper contract to be implemented on both sides. 
> *if we take the previous analogy. In order for the light bulbs to switch on/off when the main switch board is turned on/off, we have to connect the wires to appropriate nodes.* It is a kind of contract. 
> Similarly, when implementing a pattern, we have to have a proper contract to implement on both sides.
> 

Let's go back and see what `notify` does for us. 

When the `Observer` registers itself for any data change in `dataList`. The **register contract** states that in case of any data change, `notify` me about it. The `Observers` use the `notify` method to do some processing or house keeping.
Let's implement it to make it more clear.


```js
//add the data to dataList
var push =  function( val ){
	dataList.push(val);
	//notify all the registered observers when the data is added
       notifyRegistered();
};
var pop =  function( val ){
	var index = dataList.indexOf(val);
	if(index > -1){
		dataList.splice(index,1);
         //notify all the registered observers when the data is removed
		notifyRegistered();
	}
};
/**
* Notify all the registered Observers
**/
var notifyRegistered = function(){
	for (var i = observers.length - 1; i >= 0; i--) {
		observers[i].notify(dataList);
	}
}
```

`notifyRegistered` service calls the `notify` method of all the registered Observers.

**Let's create some test code and run it.**

```js
//create an Observer
var Observer = function(){};
Observer.prototype.notify = function(data){
	console.log("notified the change");
	console.log("dataList = ", data);
};
//create a subject. in this case let's assume it is a data base
var db = new Subject();
//add the different Observer instances
db.addListener(new Observer());
db.addListener(new Observer());
//do some data changes
db.push(111);
db.push(222);
db.pop(111);
db.pop(111);
db.pop(12121221);
```

**Output**- *in case you are interested*


```
$ node Observer.js 
notified the change
dataList =  [ 111 ]
notified the change
dataList =  [ 111 ]
notified the change
dataList =  [ 111, 222 ]
notified the change
dataList =  [ 111, 222 ]
notified the change
dataList =  [ 222 ]
notified the change
dataList =  [ 222 ]

```
Below is final code template:
<script src="https://gist.github.com/igagrock/423778c9a28ea870345b8fec660722fa.js"></script>

**P.S**

Observer pattern is easier to implement. you can enhance the code by adding different types of notifications. There is no limit in how it can improvised and used in real world applications. 







