---
layout: seriesPost
bannercolor: "red darken-4"
title:  "AngularJs Directive - bindToController, Controller, ControllerAs"
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

####  API for registering directives

Directives are created using `angular.directive` API. It is a similar syntax used to create controllers or services. This API takes a `directive name` followed by a factory function which returns a `Directive Definition Object`. Directive Definition Object, as the name suggests, contains various options which are used by the `compile service`  for adding custom behaviors to DOM elements. 
Below are some of the options :
* **priority**: It is used to sort the directives before they are compiled.
* **terminal**: Sets the current priority as the last. The included directives in templates are also excluded from the execution order set by their own priority.
* **scope**: By default, directives scope is set to false and inherit from the parent scope. if set to `true`, the child scope is created. If multiple directives on an element request for child scope, only one child scope is created. If the scope is an object `{ ... }`, it creates an isolate scope. I will explain it later in the tutorial.
* **bindToController**: binds the scope elements directly to the controller.
* **controller**: controller constructor function. 
* **controllerAs**: Alias to the controller
* **require**:  Inherit another directive.
* **restrict**: specify the type of directive(EACM)
* **template/templateUrl**: template view or the URL of it
* **transclude**: if set to true, Element content is compiled and made available to the directive as a transclude function.
* **compile**: function to compile the directive
* **Link**: function to link the scope with the compiled element.


