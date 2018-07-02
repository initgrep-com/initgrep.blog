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

* #### Directive compile process

  Directives are compiled in a series of steps listed below:

  1. `$compile service` traverses the DOM nodes and finds the elements matching which matches a directive. A single element can match multiple directives. All the matched directives are added to a list.
  2. Sorting happens on the basis of directive `priority`. After that, each directive `compile` functions are executed and each element is compiled.
     Each compile function returns a `link` function. Since all the directives are compiled, a `combined linking function`  is created which invokes each listed directive's link functions. A compile function is called only once. 
  3. The `link` function of each directive executed. It results in attachment of `scope` with the templates. Also `$watches` are registered on scope and `listeners` on DOM elements.

  ```js
  var $compile = ...; // injected into your code
  var scope = ...;
  var parent = ...; // DOM element where the compiled template can be appended
  
  var html = '<div ng-bind="exp"></div>';
  
  // Step 1: parse HTML into DOM element
  var template = angular.element(html);
  
  // Step 2: compile the template
  var linkFn = $compile(template);
  
  // Step 3: link the compiled template with the scope.
  var element = linkFn(scope);
  
  // Step 4: Append to DOM (optional)
  parent.appendChild(element);
  ```

  ***The above code is the exact copy of [AngularJS compile docs](https://docs.angularjs.org/guide/compiler#how-directives-are-compiled)***


