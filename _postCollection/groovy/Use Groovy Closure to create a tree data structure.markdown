---
layout: seriesPost
bannercolor: "blue-grey"
title:  "Use Groovy Closure to create a tree data structure"
date:   2016-10-31
meta: "Closure is an open, anonymous, block of code that can take arguments, return a value and be assigned to a variable."
excerpt: "Closure is an open, anonymous, block of code that can take arguments, return a value and be assigned to a variable."
category: groovy
comments: true
author: "sheikh irshad"
twitter: imshykh	
facebook: irshsheikh
github: gagrock
image: closure.jpg
categories:
    - groovy
    - all
---

> As per [Apache groovy Documentation](http://groovy-lang.org/), "Groovy is a powerful, optionally typed and dynamic language, with static-typing and static compilation capabilities, for the Java platform aimed at improving developer productivity thanks to a concise, familiar and easy to learn syntax. It integrates smoothly with any Java program, and immediately delivers to your application powerful features, including scripting capabilities, Domain-Specific Language authoring, runtime and compile-time meta-programming and functional programming."

{% include ads/article-ads.html %}

I recently started using Groovy. Part of my job is heavily dependent on creating a tree structure based on a data table with each row having a relationship with other row. i.e `id` of one row will be equal to `parent_id` of other row.

Groovy has this amazing feature called `closures`. As a simple form, `closures` look like
```groovy
 def closureName = { param1, param2 ->
  println param1
  println param2
 }
```
> As per the documentation, "Closure is an open, anonymous, block of code that can take arguments, return a value and be assigned to a variable. A closure may reference variables declared in its surrounding scope. "
Let's say, we have a closure nested inside another closure. you can call a top level using `Delegation strategy`. `owner` corresponds to the enclosing object where the closure is defined, which may be either a class or a closure.

{% include ads/article-ads.html %}
For example:

```groovy

//top level closure -- (1)
def closureName = { hetorgenousArray ->
      
      /**java.util.List contains each(Closure closure) method 
      * which takes closure as    parameter
      * this is our inner closure --(2)
      **/
      hetorgenousArray.each{ item->
        if(item instanceof java.util.ArrayList){
          //call the top level closure
          owner.call(item)
       }
       else println item
      
      }
      
 }
//heterogenous array.contains Integer and array of integers as its elements
def heteroArray = [1,2,[11,22,33,[111,222,333]],4,5]

//call the closure on this array
closureName heteroArray
```
{% include ads/article-ads.html %}

The output of the above code is

```console
1
2
11
22
33
111
222
333
4
5


```


Referring to the code above, it becomes pretty easy to call a top level enclosing closure `(1)` with in a nested inner closure `(2)`.

Except `Owner`, Groovy closures also contain Other Delegation strategy. you can check [Offical Groovy Documentation for closure](http://groovy-lang.org/closures.html#_delegation_strategy) for a detailed explaination.
