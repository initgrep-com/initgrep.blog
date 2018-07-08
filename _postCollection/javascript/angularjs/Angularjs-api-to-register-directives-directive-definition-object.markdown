---
layout: seriesPost
bannercolor: "red darken-2"
title:  "API for registering directive- Directive Definition Object"
date:   2018-07-06
meta: "Directives are created using angular.directive API. This API takes a directive name followed by a factory function which returns a Directive Definition Object. "
excerpt: "Directives are created using angular.directive API. This API takes a directive name followed by a factory function which returns a Directive Definition Object. "
category: angularjs
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: igagrock
image: regapi.jpg

---

Directives are created using `angular.directive` API. It is a similar syntax used to create controllers or services. This API takes a `directive name` followed by a factory function which returns a `Directive Definition Object`. Directive Definition Object, as the name suggests, contains various options which are used by the `compile service`  for adding custom behaviors to DOM elements. 
Below are some of the options :


  *  **multiElement**: If set to `true`, the compiler will collect DOM nodes between nodes with the attributes directive-name-start and directive-name-end, and group them together as the directive elements. By default, it is set to `false`. 
* **priority**: It is used to sort the directives before they are compiled.
* * **terminal**: Sets the current priority as the last. The included directives in templates are also excluded from the execution order set by their own priority.
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

Below is an example directive with directive definition object. 
```js
directive('directiveDefApi', function factory(injectables) {
  var directiveDefinitionObject = {
    priority: 0,
    template: '<div>hello</div>', // or // function(tElement, tAttrs) { ... },
    // or
    // templateUrl: 'directive.html', // or // function(tElement, tAttrs) { ... },
    transclude: false,
    restrict: 'A',
    templateNamespace: 'html',
    scope: false,
    controller: function($scope, $element, $attrs, $transclude, otherInjectables) {  },
    controllerAs: 'stringIdentifier',
    bindToController: false,
    require: 'siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
    multiElement: false,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
         pre: function preLink(scope, iElement, iAttrs, controller) { ... },
         post: function postLink(scope, iElement, iAttrs, controller) { ... }
      }
      // or
      // return function postLink( ... ) { ... }
    },
    // or
    // link: {
    //  pre: function preLink(scope, iElement, iAttrs, controller) { ... },
    //  post: function postLink(scope, iElement, iAttrs, controller) { ... }
    // }
    // or
    // link: function postLink( ... ) { ... }
  };
  return directiveDefinitionObject;
});
```

Each of the options has the desired effect on the functionality of a directive. It is outside the scope of this post to explain each of the options in detail.  It would require quite a real estate and time to elaborate each of them.  Hopefully, I will publish the detailed posts about them soon. 