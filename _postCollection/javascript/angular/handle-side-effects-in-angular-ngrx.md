---
layout: post
bannercolor: "light-green accent-3"
title:  "Ngrx Effects - Isolate side-effects in angular applications"
date: 2020-09-15
meta: "NgRx Effects use observable action streams to isolate side effects from components."
excerpt: "NgRx Effects use observable action streams to isolate side effects from components."
category: angular
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: irshsheik
image: /assets/images/rxjs-effects.jpg
categories:
  - angular
  - javascript
  - typescript
  - all
---

&nbsp;

##### Table of contents

- **What is a Side effect?**

- **Why NgRx Effects?**
  
  - Service based design vs NgRx Effects based design

- **NgRx Effects** 
  
  - Installation
  
  - Implementation
  
  - Register NgRx Effects in module
    
    

&nbsp;

## what is a Side-effect?

A [side effect](http://en.wikipedia.org/wiki/Side_effect_%28computer_science%29) refers simply to the modification of some kind of state - for instance:

- *Changing the value of a variable;*

- *Writing some data to disk;*

- *Enabling or disabling a button in the User Interface.*

...[source](https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect) 



&nbsp;

## Why NgRx Effects?

 A pure component has an immutable input and produces the events as output. These components are essentially dumb and most of the computations are done outside of it. A pure component has a single responsibility similar to *pure functions*.

Now, If the components are not doing any computations, most of the computations and side-effects would be moved to the services. In fact, that is the first-hand use of angular services. It is easy to inject them into components and perform various computations.

Now here are a few things you should consider -

- First of all, if your application is growing fast and you are storing/managing state inside your components or services, you should consider a state management solution.

- The services are an ideal choice but you have to manually take care of storing the state, making sure the state remains immutable, consistent, and available for all the dependent components as well as services.

- Let's assume, you have a service taking care of communicating via APIs to some remote server. You inject the service in a component and call the method of the service inside the component.

- ...and if  you have another service that performs some computation which is scheduled to be run when the user interacts with UI such as a click of a button. Again, you would inject the service in component, and on `click` of the button, a method of the service is called.

It works great... But if you notice, the component is tighly coupled with the service  and it knows about what operations to perform when a user *clicks a button* or when an API should be called. 

The very first **disadvantage** of this pattern you would come across is ***components are hard to test since they are dependent on many services***. You would also notice that It is almost ***impossible to reuse the components***.

&nbsp;

***So what is the alternative approach?***...

The alternative approach is to let components be pure and not responsible for managing the state . Instead make them reactive so that when an input data is available, it renders it to UI and when there are UI interactions, it generates the relevant Events.

That is it...

The component does not have to know, how the Input data is made available or how the events are handled.

**The services are nevertheless an important part of the application. They would still contain all the methods to do various computations or communicate via APIs. But now they are no longer being injected inside the component.**



I have already written a post about [ reactive state management using NgRx store, actions, and selectors.](/posts/javascript/angular/state-management-in-angualar-using-ngrx) You can go through it to have an understanding of NgRx state management.

We discussed the service based approach above. Let's see a comparison between the service based design and NgRx effects. 

You might notice fewer elements in play during service based design but don't let it fool you. It is better to have more elements in application than to have a lousy app.

&nbsp;

{% include ads/article-ads.html %}

&nbsp;

### Service based design

Suppose, our `AppComponent `requires a list of users. 

- We have a service `AppRemoteService`  and it contains  `users$ observable`  which can be subscribed to get a list of users.
  
  ```typescript
  users$ = this.httpClient.get<User[]>(URL).pipe(take(1));
  ```

- We have injected the `AppRemoteService` in side the `AppComponent` and we would subscribe to `AppRemoteService.users$` observable . 
  
  ```typescript
  @Component({
      template: `
      <div class="user-container" 
        *ngIf="localUsers">
       <app-user *ngfor="let user of localUsers" 
                  [inputUser]="user">
    </div>
      `
  })
  export class AppComponent{
  //state inside component
  localUsers: User[];
  
  constructor(private remoteService: RemoteService){}
  
    ngOnInit(){
        //handle the subscription here
    this.remoteService.users$.subscrible(
        users => this.localUsers = users;
        );
    }
    } 
  ```

### NgRx Effects based design

Here is how NgRx effects will change it -

- The AppComponent would only require `NgRx Store` to select the `state` or dispatch `actions`.
  
  ```typescript
  export class AppComponent implements OnInit {
   constructor(private store: Store<fromApp.AppState>) { }
   }
  ```

- As soon as the component requires the list of users, it would dispatch an action `loadUsers` when the component is initialized.
  
  ```typescript
  export class AppComponent implements OnInit {
   constructor(private store: Store<fromApp.AppState>) { }
  
   ngOnInit(): void {
       //action dispatched
      this.store.dispatch(fromActions.loadUsers());
   }
  
  }
  ```

- The Component will use **NgRx selector** `selectUsers` and subscribe to its observable. 
  
  ```typescript
  
  @Component({
   template: `
       <div class="user-container" 
           *ngIf="localUsers$ | async as users">
           <app-user *ngfor="let user of users" 
                      [inputUser]="user">
       </div>
   `
  })
  export class AppComponent implements OnInit {
    localusers$ = this.store.select(fromSelectors.selectUsers);
  
    constructor(private store: Store<fromApp.AppState>) { }
  
    ngOnInit(): void {
      this.store.dispatch(fromActions.loadUsers());
    }
  }
  ```

- **NgRx Effects** will be listening to the stream of actions dispatched since the latest state change. `loadUsers$` effect is interested in `loadUsers` action dispatched by `AppComponent`. As such, when the component is initialized, the `loadUsers` action is dispatched. The effect reacts to it and subscribes `remoteservice.users$` .

- Once the data is fetched, the `loadUsers$` effect will dispatch `addUsers` action with associated metadata - users. The respective reducer function will transition the state. The latest state will contain recently feteched users.
  
  ```typescript
  //app.effects.ts
   loadUsers$ = createEffect(
      () => this.action$.pipe(
          ofType(AppActions.loadUsers),
          mergeMap(() => this.remoteService.users$
          .pipe(
              map(users => AppActions.addUsers({ users })),
              catchError(error => {
              return of(error);
              })
          )),
   ));
  ```
  
  ```typescript
  
  //app.reducer.ts
  //addUsers action mapping 
  
  const theReducer = createReducer(
    initialState,
    on(AppActions.addUsers, (state, { users }) => ({
      ...state,
      users: [...users]
    }))
  
  );
  ```

- As soon as the data is available, the `localusers$` observable subsrciption will have users list ready for the component to render.

In contrast with the service-based approach isolating the side-effects using NgRx Effects, the component is not concerned about how the data is loaded. Besides allowing a component to be pure, It also makes testing components easier and increases the chances of reusability.

&nbsp;

## NgRx Effects

NgRx Effects are injectable services similar to Angular services. These services are long running and listen to an observable stream of *all* Actions dispatched. If the effect is interested in any action , it  performs a task(side-effects) and return another Action back to Action Stream. 

> *NgRx Effects may not always dispatch a new action upon completion of a side-effect.*



## Installation

```bash
# angular CLI 6+
ng add @ngrx/effects@latest
# < 6
npm install @ngrx/effects --save
```

Here is the complete [project setup](https://github.com/initgrep-post-demos/ngrx-demo).

Below is the service which contains methods for fetching data via API's.

```typescript
//app-remote.service.ts

const USERS_PATH = 'https://jsonplaceholder.typicode.com/users';
const POSTS_PATH = 'https://jsonplaceholder.typicode.com/posts';

@Injectable({
  providedIn: 'root'
})
export class AppRemoteService {
  constructor(private httpClient: HttpClient) { }

  /** 1) - fetch users from the remote server */
  users$ = this.httpClient.get<User[]>(USERS_PATH).pipe(take(1));

  /** 2) - fetch posts from the remote server */
  posts$ = this.httpClient.get<Post[]>(POSTS_PATH).pipe(take(1));

}
```

&nbsp;

## Implementation

![](/assets/images/ngrx-effects-flowchart.svg)

*<u>Flow diagram of NgRx Effects</u>*

- We would require an injectable service for create effects. Let's go ahead and create an `Effect` service, name it `AppEffects`   and make it injectable using `@Injectable` decorator.

- NgRx Effects listens to an Observable Action stream dispatched since the latest state change and it provided by `Actions` service. Let's inject an instance of  `Actions` service in our AppEffects service.
  
  ```typescript
  import { Actions } from '@ngrx/effects/';
  
  @Injectable()
  
    export class AppEffects{
        constructor( private action$: Actions){}
   }
  ```

- The sole purpose of NgRx Effects is to isolate the side-effects from components. Instead of directly calling side-effects inside components, we would now call them in NgRx effects. As such, other services can also be injected into `AppEffect` service. These services can be used to interact with external apis or perfrom computations. We will inject our `AppRemoteService` which contains methods to fetch data via APIs.
  
  ```typescript
  import { Actions } from '@ngrx/effects/';
  import { AppRemoteService } from '../app-remote.service';
  
  @Injectable()
   export class AppEffects{
  
     constructor( 
         private action$: Actions,
         private remoteService: AppRemoteService
       ) { }  
  }
  ```

Inside the AppEffects service, The `createEffect` function is used to create the effects. It takes two arguments.  Lets see how each of these arguments are defined.

**The first argument is a function which returns an observable.**

```typescript
() => Observable<Action | unknown>
```

Below are the steps, we will follow to create this function--

- First of all, we will access the `Actions` instance observable.

- ...then we will use pipeable  [ofType](https://ngrx.io/api/effects/ofType) operator function.  `ofType` operator function takes one or more actions as arguments and filters the Actions stream based on provided arguments.
  
  ```typescript
  () => this.actions$.pipe(
      ofType(AppActions.loadUsers)
  )
  ```

- The stream of actions is flattened and mapped to  new observables using a RxJs flattening operators such as `MergeMap, concatMap, exhaustMap`.  At this point, the computation or external API calls are performed depending on the task.
  
  ```typescript
  () => this.actions$.pipe(
       ofType(AppActions.loadUsers),
       //flatten the actions
       mergeMap(
       (action) => this.remoteService.users$
  )
  ```
  
  *We have provide only one action as argument to `ofType` operator function. But you could provide multiple actions. In that case, the effect will execute the tasks for any matched Action.*

- Finally 
  
  - If the task is successful, a new action with optional metadata is returned as an observable 
  
  - If an error occurs, an Observable of error is returned.
  
  ```typescript
  () => this.actions$.pipe(
      ofType(AppActions.loadUsers),
      //flatten the actions
      mergeMap((action) => this.remoteService.users$
          .pipe(
              //maps the users to addUser action
              map(users => AppActions.addUsers({ users })),
              // return Observable<any> to catch error
              catchError(error => {
                  return of(error);
               })
           )
      );
  ```

**The second argument is the EffectConfig to configure the effect**

```typescript
interface EffectConfig{
   dispatch: boolean;
   useEffectsErrorHandler: boolean;
}
```

- `Dispatch`:
  
  - `dipatch:true` conveyes that the  action emitted by the effect is dispatched to the store.
  
  - `dipatch:false` means the effect does not need to return an action.

- `useEffectErrorHandler` determines if the effect should be resubscribed incase an error occurs.

Below is the final version *`loadUsers$`* effect -

```typescript
 loadUsers$ = createEffect(
 () => this.action$.pipe(
    ofType(AppActions.loadUsers),
    mergeMap(() => this.remoteService.users$
      .pipe(
        map(users => AppActions.addUsers({ users })),
        catchError(error => {
          return of(error);
        })
      )),
  ));
```

*Similarly we can create `loadPosts$` effect. which is mapped to `loadPosts action` and return `addPosts` action*

&nbsp;

{% include ads/article-ads.html %}

&nbsp;

### Effects that require input state.

Let's assume, our app also requires to show notifications upon operation success.  

- We have a `showNofitication(message:string)` method which is responsible to show the notifications.  The messages shown by the notification is contextual and hence the message should be passed to the method as argument . 

- We also have an action  `[Notification] operation Success` which carries the `message` metadata.

- The effect will access the metadata of the selected action and pass it on to the `showNotification Method`

```typescript
//app.actions.ts

export const operationSuccess = createAction(
 '[profile] operation success',
 props<{message: message}>()
);
```

```typescript
//app.effects.ts

  operatorSuccessNotify$ = createEffect(() => this.action$.pipe(
    ofType(AppActions.operationSuccess),
    mergeMap((action) => 
       of(
           this.notificationService.successNotification(action.message))
       )
  ),
    {
      dispatch: false
    }
  );
);
```

Notice:  `dispatch` is set to `false` for this effect. That means, it does not return any new action.

There could also be scenarios where the lastest state of the application is required in the NgRx Effects. In that case, the state has to be accessed directly using NgRx Selectors and RxJS`withLatestFrom`operator function. `withLatestFrom` operator function should be used inside a flatening operator to prevent the selector from firing untill the correct action is dispatched.

Lets say, the effect requires latest number of posts, we will use `selectPosts` selector.

```typescript
    () => 
        this.action$.pipe(
            ofType(AppActions.updateSize),
            concatMap((action) => 
                    of(action).pipe(
                    withLatestFrom(
                            this.store.select(fromSelectors.selectPosts)
                     )) 
             ),

             ....
        )
)
```

&nbsp;

## Register the effects

Depending on the requirement, you can either create one Effects service for all application or seperate Effect services for each feature module. That means we can be register Effects in the application module or seperately in feature modules.

```typescript
EffectsModule.forRoot([AppEffects]);
//OR
EffectsModule.forFeature([ProfileFeatureEffects]);
```



{% include ads/article-ads.html %}
