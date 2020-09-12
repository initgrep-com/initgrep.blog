---

---

## Ngrx Effects - Handle side-effects in angular apps

## Side-effects

A [side effect](http://en.wikipedia.org/wiki/Side_effect_%28computer_science%29) refers simply to the modification of some kind of state - for instance:

- *Changing the value of a variable;*

- *Writing some data to disk;*

- *Enabling or disabling a button in the User Interface.*

-- *[source](<u><a href="https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect">https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect</a></u>)*

It is recommended to keep components as pure as possible. A pure component has an immutable input and produces the  events as ouput. These components are essentially dumb and most of the computations are done outside of it. A pure component has a single responsibilty similar to *pure functions*. 

Now, If the components are not doing any computations(*which they never should do unless it  is end of the world and u got no other option*), most of the computations and side-effects are  present in the services. That is the first hand use of angular services. It is easy to inject them in components and perform various computations. 

Now here are few things you should consider -

- First of all, if your app is growing fast and your are storing/managing state inside your components or services, you should definetly consider a state management solution.

- The services are an ideal choice but you have to mannually take care of storing the state, making sure the state remain immutable, consistent, and  available for all the dependent  components as well as services.

- Let's assume, you have a service taking care of communicating via API's to some remote server.  You inject the service in a component and call the method inside the component.

- Lets assume, you have another service, which performs some computation which is supposed to be run when user interacts with UI such as click of a button. Again, you would inject the service in component and on `click` of the button, the  method/computation is called.

It works great.. But if you notice, the component knows about what operations to perform when a user clicks a button or when an API should be called. The very first disadvantage of this pattern you would come across  is components are hard to test since they are dependent on many services. you would also notice that is almost impossible to reuse the components. 

*So what is the alternative approach?*

The alternative approach is to make components is let them be free and not let them be responsible for managing the state or performing the computations. Instead make them reactive so that when an input data is available, it renders it to UI and when there are UI interactions, it generates some Events. 

That is it.. 

The component does not have to know, how the Input data is made available or how the events are handled.

The services are still an important part of the application. Infact, they still contain all the methods to do various computations or communicate via API's. But Now the services are no longer being injected inside the component. 

 I have already  written a post about reactive state management using NgRx store, actions and selectors. I would advise you to go through that.

we discussed the two approaches. Let's see a comparison between the two approaches. 

**service based apporach**

Suppose, our appcomponent requires a list of users. 

- we have a service `AppRemoteService`  and it contains  `users$ observable`  which would provide us users upon a subscription. 
  
  ```typescript
  users$ = this.httpClient.get<User[]>(URL).pipe(take(1));
  ```

- we have injected the `AppRemoteService` in side the `AppComponent` and we are subscribing to `AppRemoteService.users$` observable . 
  
  ```typescript
  @Component({
      template: `
      <div class="user-container" *ngIf="localUsers">
       <app-user *ngfor="let user of localUsers" [inputUser]="user">
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
  ```

  }

```



 **NgRx Effects based approach**

Here is how NgRx effects will change it:

- The AppComponent would only require `NgRx Store` to select the `state` or dispatch `actions`. 

  ```typescript
  export class AppComponent implements OnInit {
   constructor(private store: Store<fromApp.AppState>) { }
  }
```

- As soon as the component requires the list of users, it would dispatch an action `loadUsers`. Most probably when the component is initialized.
  
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
       <div class="user-container" *ngIf="localUsers$ | async as users">
           <app-user *ngfor="let user of users" [inputUser]="user">
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

- NgRx Effects will be listening to the stream of actions dispatched since the latest state change. `loadUsers$` effect is intersted in `loadUsers` action dispatched by `AppComponent`. As such, when the component is initialized, the `loadUsers` action is dispatched. The effect reacts to it and subscribes `remoteservice.users$` .

- Once the data is fetched, the `loadUsers$` effect will dispatch another action, `addUsers` with associated metadata. The reducer will add the data to store.
  
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

- As soon as the data is available, the component will have the data to render.

Compared to earlier service based approach, the component is not dependent on a service. Neither is it concerned how the data is loaded. Besides allowing the component to be pure, It will also make testing components easier.

## NgRx effects

NgRx effects are injectable services similar to Angular services. These services are long running and listen to an observable stream of *all* actions dispatched. If the effect is intersted in any action , it  performs a task(side-effects) and return another Action back to Action Stream. 

> *NgRx Effects may not always dispatch a new action upon completion of a side-effect.*

## Installation

```bash
# angular CLI 6+
ng add @ngrx/effects@latest
# < 6
npm install @ngrx/effects --save
```

This is the `AppRemoteService` which contains methods for calling API's

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

## 

## Implementation

- Lets create an `Effect` service  such as `AppEffects`  and make it injectable using `@Injectable` decorator.

- Effects require an instance of  `Actions` service . Actions is an injectable service that  provides an Observable stream of all actions dispatched after the lastest state change.
  
  ```typescript
  import { Actions } from '@ngrx/effects/';
  
  @Injectable()
  
    export class AppEffects{
        constructor( private action$: Actions){}
   }
  ```

- Other services can also be injected into `AppEffect` service. These services are used to interact with external apis or perfrom computations. We will inject `AppRemoteService`.
  
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

Inside the Effects service, The `createEffect` function is used to create the effects. It takes two arguments.  Lets see how each of these arguments are defined.

**The first argument is a function which returns an observable.**

```typescript
() => Observable<Action | unknown>
```

The fist argument essentially contains below steps:

- `Action` observable is subscribed

- `OfType` operator is used to filter the actions stream based on given actions.
  
  ```typescript
  () => this.actions$.pipe(
      ofType(AppActions.loadUsers)
  )
  ```

- The stream of actions is flattened and maped to  new observables using a RxJs flattening operators such as `MergeMap, concatMap, exhaustMap`.  At this point, the computation or external API calls are performed depending on the task.
  
  ```typescript
  () => this.actions$.pipe(
       ofType(AppActions.loadUsers),
       //flatten the actions
       mergeMap(
       (action) => this.remoteService.users$
  )
  ```

- Finally 
  
  - if the task is successful, a new action with optional metadata is returned as an observable 
  
  - If an error occurs, optionally an Observable of error is returned.
  
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
  
  - `dipatch:true` conveyes the action emitted by the effect is dispatched to the store.
  
  - `dipatch:false` means the effect does not need to return an action.

- `useEffectErrorHandler` determines if the effect should be resubscribed incase an error occurs.

Below the final version *loadUsers$* effect -

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

*Similarly we can create `loadPosts$` effect. which is mapped to `loadPosts action` and return `addPosts` action*`

### Effects that require input state.

Let's assume, our app also requires to show notifications upon operation success.  

- We have a `showNofitication(message:string)` method which is responsible to show the notification.  The messages shown by the notification is contextual and hence should be passed to the method everytime it is called. 

- we also have an action  `[profile] operation Success` which carries the `message` metadata.

- The effect will access the metadata of the selected action and pass it to the `showNotification Method`

```typescript
//app.actions.ts

export const operationSuccess = createAction(
 '[profile] operation success',
 props<{message: message}>()
);
```

```typescript
//app.effects.ts

showNotificationEffect = createEffect(
    () => 
    this.action$.pipe(
        ofType(AppActions.opSuccess),
        mergeMap((action)=> showNotification(action.message))
    ),
    //EffectConfig
    {
        dispatch: false
    }
);
```

Notice:  `dispatch` is set to `false` for this effect. That means, it does not return any new action.

There could be scenarios where the lastest state is required in the effect. In that case, the state has to be accessed directly using selectors and Rxjs`withLatestFrom`operator. `withLatestFrom` operator should be used inside a flatening operator to prevent the selector from firing untill the correct action is dispatched.

Lets say, the effect requires number of posts, we can write

```typescript
createEffect(
    () => 
        this.action$.pipe(
            ofType(AppActions.updateSize),
            concatMap((action) => 
                    of(action).pipe(
                    withLatestFrom(
                            this.store.select(fromSelectors.selectUsers)
                     )) 
             ),

             ....
        )
)
```

## 

## Register the effects

Depending on the requirement, you could either have one Effects service for all application or seperate Effect services for each feature module. As such, Effects can be registed in the app module or seperately in feature modules.

```typescript
EffectsModule.forRoot([AppEffects]);
//OR
EffectsModule.forFeature([ProfileFeatureEffects]);
```
