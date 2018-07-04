---
layout: seriesPost
bannercolor: "red darken-4"
title:  "AngularJs Directive -compile and link function"
date:   2018-06-26
meta: " AngularJS Directives is a unit of reusable code which is used to add custom behavior to HTML elements or attributes."
excerpt: "AngularJS Directives is a unit of reusable code which is used to add custom behavior to HTML elements or attributes."
category: angularjs
comments: false
author: "sheikh irshad"
twitter: imshykh	
facebook: irshsheikh
github: igagrock
image: ngfilter2.jpg

---





Before we understand the role of `compile` and `link` function in a directive. Let me list down the sequence of steps followed by AngularJs `$compiler` service to compile the directives. 

1. `$compile` service traverses the DOM nodes and finds the elements matching which matches a directive. A single element can match multiple directives. All the matched directives are added to a list.
2. Sorting happens on the basis of directive `priority`. After that, each directive's `compile` functions are executed and each element is compiled.
3. Each compile function returns a `link` function. Since all the directives are compiled, a combined linking function is created which invokes each listed directive's link functions. A compile function is called only once. 
4. The `link` function of each directive is executed. During the execution of link function scope is attached with the templates and  `$watches` are registered on scope and listeners on DOM elements.

```js
var $compile = ...; // injected into your code
var scope = ...;
var parent = ...; // DOM element where the compiled template can be appended

var html = '<div ng-bind="exp"></div>';

// Step 1: parse HTML template into DOM element
var template = angular.element(html);

// Step 2: compile the template
var linkFn = $compile(template);

// Step 3: link the compiled template with the scope.
var element = linkFn(scope);

// Step 4: Append to DOM (optional)
parent.appendChild(element);
```

***The above code is the exact copy of [AngularJS compile docs](https://docs.angularjs.org/guide/compiler#how-directives-are-compiled)***

I hope it was clear enough. Lets get back to the role of compile and link functions.

Compile function does the one-time activity and could be used to do some initialization. Link function is used to perform DOM
manipulation and copy content into the DOM from the scope.
>**RULE OF THUMB:** 
If there is a one-time activity common to all instances of the directive. It should be moved to compile function.

##### Compile function:
```js
function compile(element, attributes, transclude) { ... }
```
1.   **element**: The element where the directive has been declared. DOM transformations can be applied to this element or its children.
2.    **attributes**:  attributes declared on the directive element
3.    **transclude**: A transclude linking function. This option is *deprecated*. I will get back to transclusion concept in directives and hopefully soon will post a tutorial about it.

The compile function can have a return type which could be either an object or a function.
1. **function**:  This can be used when a link function is returned. This is specifically a `post-link` function. 
```js
directive("dumyCompile",function(){
  return {
     compile: function(element, attributes, transclude){
       return function(scope, element, attrs, controller, transcludeFn){
           // this function is a post link function.
            // Dom manipulation and adding listeners to DOM element can be done here.
        }
    }
  }
})
```
2. **object**: when both `pre-link` or `post-link`  functions or both are returned. options `pre` and `post` can be used to register the functions respectively.
```js
angular.directive("dumyCompile",function(){
  return {
    compile: function(element, attributes, transclude){
      // adding the font size to the element
       return {
          pre: function(scope, element, attrs, controller, transcludeFn){
                //  this function is a pre link function.
                // Dom manipulation and adding listeners to DOM element 
                //CAN NOT be done here. 
              },
          post: function(scope, element, attrs, controller, transcludeFn){
                //  this function is a post link function.
                // Dom manipulation and adding listeners to DOM element
                // can be done here.
            }
       } 
    }
  }
})
```




Let's go ahead and create a directive and implement `compile` function. Since a compile function returns a `link` function, we need to make sure, our compile function returns the `link` function.




