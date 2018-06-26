---
layout: seriesPost
bannercolor: "pink darken-4"
title:  "Creating Custom Filters in AngularJS"
date:   2018-06-26
meta: "Creating Custom Filters in AngularJS"
excerpt: "Creating Custom Filters in AngularJS"
category: AngularJS
comments: false
author: "sheikh irshad"
twitter: imshykh	
facebook: irshsheikh
github: igagrock
image: mod.jpg

---

Filters are one of the AngularJS features which help in filtering or formatting the data for the end user.
There are a number of built-in filters such as `filter`, `currency`. [Built-in-filters](https://docs.angularjs.org/api/ng/filter) section in AngularJs documentation has a complete list.

Let's begin with a simple filter example.

```js
// _.js
angular.module('customFilterApp', [])
.controller('MainCtrl',["$scope", function($scope) {
  $scope.name = 'hello';
}])
.filter('initcaps',function(){
  var initcaps = function(value){
    return value.charAt(0).toUpperCase()+value.slice(1);
  }
  return initcaps;
});
```

```html
<!-- _.html -->
  <body ng-app="customFilterApp" ng-cloak>
    <div ng-controller="MainCtrl">
      <h1>initcaps {{"{{ name | initcaps "}}}}</h1>
    </div>
  </body>
```

I have created an AngularJs module `customFilterApp` with a controller registered as  `MainCtrl`. I have also added a variable `name` to the controller's scope. 

> To register a filter, you have to add a factory function which returns a new filter function. 
>The filter function should follow below rules:
>1. It has to be a `pure function`. i.e. For the same input, the result output returned should always be the same.
>2. The filter function takes the input value as the first argument. It can have additional arguments also.
>3. It should not change the external state. 
>4. Filters should be valid AngularJs Expression identifiers such as `uppercase` or `orderBy`. Names with special characters, such as hyphens and dots, are not allowed. 

Before we move ahead, let me briefly explain a few core concepts.

**Digest Cycle:**
Digest Cycle is AngularJS way of tracking each change in the scope and updating the template views and vice versa. Scope at its core is a set of key-value pairs of data. AngularJS registers watchers on each of the scope value. The value could be a primitive or Javascript object. When a Digest Cycle is initiated, all the watchers are called. If the value has changed since the last Digest cycle, the listener functions are run to update the corresponding expressions where the values are used. 

**Interpolation:**
Interpolation expressions such `{{"{{ an-expression "}}}}` is used to provide two-way data binding for text nodes or attribute values of DOM. During the compilation process, text nodes and attribute values are scanned by `$compile`  service. If the interpolation is found, `InterpolationDirective` is added to the node and an Interpolation function is computed. After that `watchers`  are added to the computed function. During the `Digest Cycle`, these watches are used to update the corresponding text nodes or attribute value.

I hope that was clear enough.

Let's get Back to Filters...

**Filter execution:**

Since filter functions are pure functions. AngularJs depends on this contract during the digest cycle. 
1. If the value is primitive, Filters in templates are executed only when the input has changed.
2. If the value is Object or the filters are registered as stateful, Filters are executed on every digest.

**Stateful filters**:
Stateful filters depend on the external state. If the external state changes, the result returned for the same input to filter function might vary. As a result, the filter is executed every time during the Digest Cycle. It is recommended to avoid stateful filter due to its extra overhead. 

```js
//_.js
angular.module('customFilterApp', [])
.controller('MainCtrl',["$scope","position", function($scope,position) {
  $scope.name = 'hellothere';
  $scope.position = position;
}])
.filter('anycaps',['position',function(position){
  var anycapsFilter = function(value){
    var pos = position.val;
    return  value.substring(0,pos)+value.charAt(pos).toUpperCase()+value.substring(parseInt(pos)+1,value.length);
  }
  anycapsFilter.$stateful = true;
  return anycapsFilter;
}])
.value('position',{val:0});
```
```html
<!-- _.html -->

 <body ng-app="customFilterApp" ng-cloak>
    <div ng-controller="MainCtrl">
      caps position: <input type="text" ng-model="position.val">
      <h1>anycaps {{"{{ name | anycaps " }}}}</h1>
    </div>
  </body>
```

I have created a stateful filter above. It is dependent on an value service to fetch the position. It is also registered as stateful. The code points are explained below.

**_.js :**

`position` is a value service. It stores the position. `anycaps` is the filter name. It returns a filter function which in turn returns a string with any given character(in UPPERCASE). The filter is registered as stateful by adding `anycapsFilter.$stateful = true;`. `position` service is injected as a dependency to the filter. The filter function uses the `val` attribute to get the position.

**_.html :**

`position.val` is binded to the value of `input` element as `<input type="text" ng-model="position.val">`. As the value changes, the filter gets executed.to

It might not be easy to figure out the difference as much from the code. But once you put some log statements and keep changing the input, you would notice the execution cycles are much higher for the stateful filter. During the execution, I noticed, for every input change, Stateless filter gets called only once but Stateful filter gets called twice.

You can check the [Create-Custom-filters-Plunker](https://next.plnkr.co/edit/rxGiA5vpJoB9YuTJ?preview) for the details...









