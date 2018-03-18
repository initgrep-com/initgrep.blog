---
layout: seriesPost
bannercolor: "blue darken-4"
title:  "Publisher-Subscriber(pub-Sub) pattern in Javascript"
date:   2017-12-31
meta: "Publisher Subscriber pattern is the loosely coupled extension of Observer pattern."
excerpt: "Publisher Subscriber pattern is the loosely coupled extension of Observer pattern."
category: Design-pattern
comments: true
author: "sheikh irshad"
twitter: imshykh	
facebook: irshsheikh
github: igagrock
image: pub-sub.jpg
---

Publisher Subscriber(Pub-Sub) pattern goes further ahead by decoupling the registration process of subscribers and publishers compared to [Observer pattern](/posts/javascript/design-patterns/observer-pattern) . It introduces a message broker or Event Bus which acts as a bridge between a publisher(Subject) and various Subscribers. The topics are published by Subject for different kinds of events. The subscriber registers for the respective topics to get notified.

Let me try an analogy for it:
> *lets say we have 10 radio stations in a city. Each radio station works at their own frequency
> In case we want to listen to radio station(A) with frequency equal to 100, we have to switch to the given frequency. 
> Radio station(A) publishes its episodes at the frequency(topic/event) 100. As a subscriber, if we want to listen to it, we have to listen at this frequency(topic/event)*
> 

 
![pubsub-analogy](/assets/images/pub-sub.svg)

Lets implement the publisher subscriber design pattern using Javascript.

**Create an Event Bus object which has the registration and publishing API**


```javascript
	
    var EventBus = function(){
    var eventTopics =  {};
    
    this.addEventListener =  function (eventName, listener) {
        if ( !eventTopics[eventName] || eventTopics[eventName].length < 1) {
                eventTopics[eventName] = [];
        }
         eventTopics[eventName].push(listener);
    };
   
    this.emitEventListeners = function (eventName , params) {
        if ( !eventTopics[eventName] || eventTopics[eventName].length < 1) return;
          eventTopics[eventName].forEach(function (listener) {
            listener( !!params ? params : {} );
        });
    }
    
} //END EventBus
```

`addEventListener` and `emitEventListeners` functions lets the subscriber and publisher to subscribe and publish on events respectively.

**An EventBus can be used as an independent object for registration and publishing such as**
```javascript
//initialize the event bus
var EventService = new EventBus();
//add the event listener
EventService.addEventListener('SEND', callback1);
EventService.addEventListener('SEND', callback2);

var EmailService = {
	createEmail = function(to, from, subject){
		//some business here
		EventService.emitEventListeners('SEND' , subject);
	} 
}
```
we can also let `EmailService extend EventBus`. This would make `EmailService`
have all the characteristics of `EventBus`. Based on the need, we can customize the API also.
	

```javascript
//extend the EventBus
var EmailService = function(){
  EventBus.call(this);
  this.createEmail = function(to, from, subject){
      //send the email
      //publish/emit the event = order/new 
      this.emitEventListeners('SEND',Subject)
 }
}
EmailService.prototype = Object.create(EventBus.prototype)
EmailService.prototype.constructor = EmailService;
```
*Note: you can use the new features of [ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) classes to extend to the EventBus object*


Now that we have extended to `EventBus`. lets create the `EmailService` Object


```javascript
	var emailService = new EmailService();
	emailService.addEventListener('SEND', callback);
```
When a business service extends to the EventBus. It makes it representational while keeping the benefits of decoupling and customization.
For example:
	In a different module, if I want to add a listener to `SEND` Event . I can do either
  
```javascript
	  EventBus.addEventListener('SEND', callback)
```
 or
 
```javascript
	 EmailService.addEventListener('SEND',callback)
```

   As you notice, in the later case it is very clear to what purpose and service are we subscribing to.
	

checkout the complete example in the below pen

<p data-height="700" data-theme-id="dark" data-slug-hash="eVZGYO" data-default-tab="js,result" data-user="igagrock" data-embed-version="2" data-pen-title="pub-sub js" class="codepen">See the Pen <a href="https://codepen.io/igagrock/pen/eVZGYO/">pub-sub js</a> by s://irshad:ahmad.(sheikh) (<a href="https://codepen.io/igagrock">@igagrock</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>




