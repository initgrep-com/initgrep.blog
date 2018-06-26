## AngularJs - Custom directives

Directives are makers of [DOM](http://www.angularjs.org). Directives control the rendering of HTML inside an application. Directives help to create customized DOM elements, attributes, CSS classes or comments.

During the $compilation phase, each of the directive is parsed and the desired functionality is added to the DOM such as Event Listeners or new content.

AngularJs comes with ample built in directives such as ng-app, ng-model, ng-repeat [etc](http://link.to.directives )

**Life Cycle of a directive**
**Basic implementation**
  A directive is registered with the module.
  
```js
   var app = angular.module('app',[]);
   app.directive('customDirective',function(){
   		var directiveDefinitionObject ={
        		restrict : 'AEC',
                  scope: {},
                  tempalate: "html template",
                 // templateUrl: "path to the template"**,
                  transclude: false
        }
        return directiveDefinitionObject;
   });

```



