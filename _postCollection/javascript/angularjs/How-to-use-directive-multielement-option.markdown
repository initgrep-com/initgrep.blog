---
layout: seriesPost
bannercolor: "yellow darken-4"
title:  "How to implement multielement directives"
date:   2018-07-09
meta: " In order To apply AngularJs directives on various elements without having to add them for every DOM element multielement option can be set to true."
excerpt: "In order To apply AngularJs directives on various elements without having to add them for every DOM element multielement option can be set to true."
category: angularjs
comments: true
author: "sheikh irshad"
twitter: imshykh  
facebook: irshsheikh
github: igagrock
image: mulele.jpg
categories:
  - angularjs
  - javascript
  - all

---

In order to apply AngularJs directives on various elements without having to add them for every DOM element, `multiElement` option can be set to `true`. On the DOM elements `directive-name-start` and `directive-name-end` will mark the collection of elements to which the directive should be applied. The HTML compiler collects DOM nodes between nodes with the attributes `directive-name-start` and `directive-name-end` and groups them together as the directive elements.
> This feature is recommended **not** be used on directives which are strictly behavioral. i.e. The directives which will add a behavior to the DOM elements such as `ng-click`

> A basic [understanding of how to create directives](/posts/javascript/angularjs/Understanding-AngularJS-Directives) is required to understand this tutorial.

{% include ads/article-ads.html %}
let's create a directive which adds an exclamation "`!`" at the end of every `paragraph`. Let's assume, we have multiple paragraphs and we are too lazy to add the directive on each of them. Here is how to do it once for all the elements.

```js
//app.js
.directive("demoMultiElement", function(){
  return {
    multiElement: true,
    link: function(scope,element, attrs, transcludefn){
      element.append(`!`);
    }
  }
})
```
Inside the directive `demoMultiElement's` [link](/posts/javascript/angularjs/AngularJs-Directive-compile-link-functions) function, element is appended with exclaimation mark `!`. Since this element is collection of nodes on which the directive will be applied, Exclaimation mark should be appended to all the nodes.
{% include ads/article-ads.html %}

```html
<!-- index.html-->
<p demo-multi-element-start> first important sentence</p>
<p>second important sentence</p>
<p demo-multi-element-end>third important sentence</p>

```
I have added `demo-multi-element-start` and `demo-multi-element-end` as above. and the output is like

```js
first important sentence!
second important sentence!
third important sentence!
```
