---
layout: seriesPost
bannercolor: "deep-orange darken-1"
title:  "Understanding AngularJS Directives"
date:   2018-07-03
meta: " AngularJS Directive is a unit of reusable code which is used to add custom behavior to HTML elements or attributes."
excerpt: "AngularJS Directive is a unit of reusable code which is used to add custom behavior to HTML elements or attributes."
category: angularjs
comments: true
author: "sheikh irshad"
twitter: imshykh	
facebook: irshsheikh
github: igagrock
image: directive1.jpg

---

 AngularJS Directives is a unit of reusable code which is used to add custom behavior to HTML elements or attributes. Directives can be added to HTML  elements, attributes, CSS classes or comments. AngularJS HTML compiler identifies each directive and attaches the specific behavior to Document Object Model(DOM) elements through event listeners.

 Directives can be of following types:

1. `E` - Element based
2. `A` - Attributes based
3. `C` -  CSS class based
4. `M` -  Comment based.

The type is specified by the `restrict` property of directive configuration object.  During the compilation process, directives are matched based on their type. If nothing is specified, the default options used for matching are **`EA`**.

Let's start with a basic directive example...
```js
//app.js   
angular.module('app', [])
.controller("appCtrl1",["$scope",function($scope){
    $scope.name = "Irshad",
    $scope.company = "initgrep inc"
    $scope.url = "www.initgrep.com"
}])
.directive("userInfo",function(){
  var userInfoDefinitionObject ={
    template : "<div> <b>Name:</b>{{"{{name"}}}}<br/><b>Organisation:</b>{{"{{company"}}}}<br/> <b>website:</b>{{"{{url"}}}}</div>",
  }
  return userInfoDefinitionObject;
})
;
```
I have created a directive named `userInfo`. The factory function returns `userInfoDefinitionObject`. The `template` includes variables such as `company`, `name` and `URL` which refer to the current scope defined in `appCtrl1` controller. `templateUrl` can be used instead of `template` and the template URL can be specified. It can also take a function which returns a template URL.

```html
<!--app.html -->
<div id="app">
	<div ng-controller="appCtrl1">
    <div user-info ></div>
    <user-info></user-info>

	</div>
</div>
```
In the HTML file, I have added `appCtrl1` controller. Inside the controller, I have added directive `user-Info` as an element and an attribute. As I stated earlier, by default the directive type is `EA`. If we want to `restrict` the attribute type to a distinct type, we will have to explicitly add `restrict` property with values among `EACM`

#### Normalization of the directive name

Directives names are defined in camel case such as `myDirective`. Since HTML is case insensitive, the directive names are matched with their dashed name `my-directive`.  Also, the prefixes such as `data-` are stripped. This process is referred to as  An example of the same is below...

```js
.directive("userInfo",function(){return directiveDefinitionObject{}});
```
```html
<div user-info ></div>
<user-info></user-info>
```



