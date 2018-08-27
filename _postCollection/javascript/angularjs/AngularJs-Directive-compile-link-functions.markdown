---
layout: seriesPost
bannercolor: "red darken-4"
title:  "AngularJs Directive - compile and link function"
date:   2018-07-08
meta: "Compile function does the one-time activity and could be used to do some initialization. Link function is used to perform DOM manipulation and copy content into the DOM from the scope."
excerpt: "Compile function does the one-time activity and could be used to do some initialization. Link function is used to perform DOM manipulation and copy content into the DOM from the scope."
category: angularjs
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: igagrock
image: cmplink.jpg

---

Before we understand the role of `compile` and `link` function in a directive. Let me list down the sequence of steps followed by AngularJs `$compiler` service to compile the directives. 

1. `$compile` service traverses the DOM nodes and finds the elements which match a directive. A single element can match multiple directives. All the matched directives are added to a list.
2. Sorting happens on the basis of directive `priority`. After that, each directive's `compile` functions are executed and each element is compiled.
3. Each compile function returns a `link` function. Since all the directives are compiled, a combined linking function is created which invokes each listed directive's link functions. A compile function is called only once. 
4. The `link` function of each directive is executed. During the execution of the link function, the scope is attached with the templates and  `$watches` are registered on scope and listeners on DOM elements.

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
{% include ads/article-ads.html %}

***The above code is the exact copy of [AngularJS compile docs](https://docs.angularjs.org/guide/compiler#how-directives-are-compiled)***

Compile function does the one-time activity and could be used to do some initialization. Link function is used to perform DOM manipulation and copy content into the DOM from the scope. Child elements that contain `templateUrl` directives will not have been compiled and linked since they are waiting for their template to load asynchronously. Their own compilation and linking are suspended until that occurs.
>**RULE OF THUMB:** 
If there is a one-time activity common to all instances of the directive. It should be moved to compile function.

I hope it was clear enough...
Let's go through the compile and link API's.

{% include ads/article-ads.html %}
##### Compile function:
```js
function compile(element, attributes, transclude) { ... }
```
1.   **element**: The element where the directive has been declared. DOM transformations can be applied to this element or its children.
2.    **attributes**:  attributes declared on the directive element
3.    **transclude**: A transclude linking function. This option is *deprecated*. 

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
2. **object**: when both `pre-link` or `post-link`  functions or both are returned. options `pre` and `post` can be used to register the functions respectively. I will explain in later when we start with link function.
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
> while creating a directive using directive registering API, You can either return a `Directive Definition Object` that defines the directive properties, or just the `postLink function`. Rest of the options will have default values. You can check [API for registering directives](posts/javascript/angularjs/Angularjs-api-to-register-directives-directive-definition-object) to learn how to create and register a directive.
> 
{% include ads/article-ads.html %}

##### Link function
```js
function link(scope, element, attributes, controller, transcludeFn) { ... }
````
Link functions is responsible for registering Listeners on DOM. It can also manipulate DOM such as update the element. It executes after the `compile` function. 
Below are the parameter definitions:
1. **scope** : The scope to be used by the directive for registering watches.
2. **element**: The element where the directive has been declared. DOM transformations can be applied to this element or its children.
3. **attributes** : Normalized list of attributes declared on this element shared between all directive linking functions.
4. **Controller**:  The value of the controller depends on the `require` property. It can either be a `string or array` which means a controller instance or array of instances respectively. If the `require` is not defined, the controller of the directive is used.
If it does not have one, controller instance would be undefined.
5. **transcludeFn** :A transclude linking function pre-bound to the correct transclusion scope. 

```js
.directive("domManipulatorWithLink",function(){
    /**
    *Object name can be omitted alltogether.
    *I have added it here for representation
    **/
   return directiveDefinitionObject{
    restrict : 'E',
    template: "<span>name</span>",
    link : function (scope, element, attrs, controller, transcludeFn) { 
            // changed the style of the element
            element.css("color", 'red');
            // added a listener to the DOM element
            element.on('mouseover',(e)=>{
                element.css("background-color","blue");
           });
      }
})
```
The link function has two types. `Pre-link` and `Post-link`. The post-link function is the commonly used while the Pre-link function is rarely used. I have added a below  difference between the two types:


|  Pre-link   | post-link    |
| --- | --- |
| Executed before the child elements are linked    |  Executed after the child elements are linked.   |
| Not safe to do DOM transformation since the compiler linking function will fail to locate the correct elements for linking.    |   Safe to do DOM transformation in the post-linking function on elements that are not waiting for their async templates to be resolved.  |

{% include ads/article-ads.html %}
**Check out the complete code example below**
```js
//app.js
import angular from 'angular';

angular.module('app', [])
.controller("appCtrl1",["$scope",function($scope){
    $scope.name = "Irshad",
    $scope.company = "initgrep inc"
    $scope.url = "www.initgrep.com"
}])
.directive("userInfo",function(){
  var userInfoDefinitionObject ={
    template : "<div> <b>Name:</b>{{name}}<br/><b>Organisation:</b>{{company}}<br/> <b>website:</b>{{url}}</div>",
  }
  return userInfoDefinitionObject;
})
.directive("domManipulatorUsingLink",function(){

  return {
    restrict : 'E',
    template: "<span>name</span>",
    link : function  (scope, element, attrs, controller, transcludeFn) { 
    // modify dom style
    element.css("color", 'red');
    //add listeners to dom
    element.on('mouseover',(e)=>{
      element.css("background-color","blue");
    });
    element.on('mouseout',(e)=>{
      element.css("background-color","transparent");
    });
    
   }
  }

})

.directive("domManipulatorUsingCompile",function(){
  function compileFn(element, attributes, transclude) { 
      element.css('font-size',"2rem");

      return (
        function  linkFn(scope, element, attrs, controller, transcludeFn) { 
    element.css("color", 'red');
    element.on('mouseover',(e)=>{
      element.css("background-color","blue");
    });
    element.on('mouseout',(e)=>{
      element.css("background-color","transparent");
    });
    
   }
      );
  }
  return {
    restrict : 'E',
    template: "<span>name</span>",
    compile: compileFn
  }

})
.directive("dumyCompile",function(){
  return {
    restrict: 'E',
     template: "<span>name</span>",
    compile: function(element, attributes, transclude){
      // adding the font size to the element
       element.css('font-size',"2rem");
       return function(scope, element, attrs, controller, transcludeFn){
         /**
          * this function is a post link function.
          * Dom manipulation and adding listeners to DOM element can be done here.
          */
       }

    }
  }
})
.directive("dumyCompile",function(){
  return {
    restrict: 'E',
     template: "<span>name</span>",
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
                // Dom manipulation and adding listeners to DOM element can be done here.
            }

       } 

    }
  }
})
;
```
```html

<!--app.html -->
<div id="app">
	<div ng-controller="appCtrl1">
    <p> A normal template </p>
    <!-- A simple template -->
		<div> <b>Name:</b> {{name}} <br/> <b>Organisation:</b> {{company}} <br/> <b>website:</b> {{url}}</div>

   
    <!-- directive called as attribute -->
     <p> using as attribute </p>
    <div user-info ></div>

    <!-- directive called as element -->
     <p> using as element </p>
    <user-info></user-info>

    <!-- adding the directive with compile function -->
    <p> directive with compile function and a link function. Compile function increases the size of element </p>
    <dom-manipulator-using-compile></dom-manipulator-using-compile>

    <!-- adding the directive with only link function -->
    <p> directive with only link function </p>
    <dom-manipulator-using-link></dom-manipulator-using-link>

	</div>
</div>

```


