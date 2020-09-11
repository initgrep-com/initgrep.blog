## Ngrx Effects - Handle side-effects in angular apps

A [side effect](http://en.wikipedia.org/wiki/Side_effect_%28computer_science%29) refers simply to the modification of some kind of state - for instance:

- *Changing the value of a variable;*

- *Writing some data to disk;*

- *Enabling or disabling a button in the User Interface.*

-- *[source](<u><a href="https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect">https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect</a></u>)*

## Pure Components

A pure component has an immutable input and produces the  events as ouput. These components are essentially dumb and most of the computations are done outside of it. A pure component has a single responsibilty similar to *pure functions*. 

Now, here are few takes from it -

- **which part of the app should fetch the data?** *The services are an ideal choice but we have to mannually take care of storing the data, making sure all operations remain immutable and the data remains available for various components. Above all inject the service instance in the component and call the method*

- **which part of the app should handle output events?**  *Again, the services are the ideal choice but we have to inject the services in the component and call the service methods. which again makes the components service bound*

It is not wrong to inject the services inside a component. Infact, that is by design and at some point a component may have to inject services. Services are meant to be injectable. But, If we follow this design. Most of our components will not be pure and will hardly be reusable.



Lets take  a step back and see how we would usually handle a side-effect in an service based Angular application. 

Suppose, We have to load User List  using from a remote server and render it in UI. we will have some kind of API call.

- we would create a service and inject `HttpClient`  and then create a method `loadUsers():User`  which will call the `httpClient.get` method and return a a list of users. 
  
  ```typescript
  users$ = this.httpClient.get<User[]>(URL).pipe(take(1));
  ```

- inside the component, we will call the `loadUsers` method and render the users in UI.
  
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
  
   loadUsers(){
       //handle the subscription here
       this.remoteService.users$.subscrible(
           users => this.localUsers = users;
       );
  }
  ```
  
  

       *you could also directly access the  `users$` observable using `async `pipe*

The above solution will work without  any issues. But if you notice carefully, the component is directly directly handling the side effects, such as fetching the data through a service.



NgRx effects solves this problem by taking away the responsibilty to handle the side-effects from components. Thus, allowing for pure components.

Here is how NgRx effects will change it:



- The AppComponent will only require NgRx store instance. 

- The AppComponent will disptach an action when it is requires the data and also subscribe to store selector for user data.
  
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

- NgRx Effects will be listening to the stream of actions dispatched since last Action. If the Effect is intersted, it will call the call the remoteService.users$ and fetch the data.
  
  ```typescript
  //app.effects.ts
  
    loadUsers$ = createEffect(() => this.action$.pipe(
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

- Once the data is fetched, It will dispatch the action, addUsers with associated metadata. The reducer will add the data to store.
  
  ```typescript
  //app.reducer.ts
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

NgRx effects  are long running services that listen to an observable stream of *all* actions dispatched. If an Action matches , it performs a side-effect and returns another Action back to Action Stream. 

> *NgRx Effects may not always dispatch a new action upon completion of a side-effect.*

## Installation

```bash
# angular CLI 6+
ng add @ngrx/effects@latest
# < 6
npm install @ngrx/effects --save
```

Lets setup a service which contains methods to communicate to remote server.

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
  users$ = this.httpClient

    .get<User[]>(USERS_PATH)
    .pipe(map(response => response), take(1));

  /** 2) - fetch posts from the remote server */

  posts$ = this.httpClient

    .get<Post[]>(POSTS_PATH)
    .pipe(map(response => response), take(1));

}
```

## Implementation

Lets get started.



- NgRx Effects are Injectable services.

- Effects require an instance of  `Actions` . Actions provide the Observable stream of all actions dispatched from NgRx store after the lastest state change.
  
  ```typescript
  import { Actions } from '@ngrx/effects/';
  @Injectable()
   export class AppEffects{
        constructor( private action$: Actions){}
   }
  ```

- Other services can be injected into NgRx Effect service. These services are used to interact with external apis or perfrom computations.
  
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

- NgRx effects filter the Actions using the pipeable `ofType` operator.
  
  

NgRx Effects provide `createEffect` function to create the effects. It takes two arguments.  we will see how each of these arguments are defined or created.



**The first argument is a function which returns an observable.**

```typescript
() => Observable<any>
```

This function logic breaks down to below points:

- Listen to `Action` Observable stream.

- Filter the Actions using `OfType` operator.
  
  ```typescript
  () => this.actions$.pipe(
      ofType(AppActions.loadUsers)
  )
  ```

- Flatten the stream of actions and map them into new observables using a RxJs flattening operators such as `MergeMap, concatMap, exhaustMap`.  At this point, a computation or external calls are performed related to the side effect.
  
  ```typescript
  () => this.actions$.pipe(
       ofType(AppActions.loadUsers),
       //flatten the actions
       mergeMap((action) => this.remoteService.users$
  )
  ```

- Finally - on Success, An action with optional returned as an observable and on Failure and Observable of error is returned.
  
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
  
  

**The second argument is the EffectConfig for effect.**

```typescript
interface EffectConfig{
   dispatch: boolean;
   useEffectsErrorHandler: boolean;
}
```

Bydefault, the `dipatch is set to true`. which means, the effect will return the Observable of action.  But sometimes we may not have to return an action from the effect, the dispactch property can be set to false. For example, In a scenario where we may to perform some background task or write logs or send a notification and does not require any transition to state.



`useEffectErrorHandler` determines determines if the effect will be resubscribed to if the error happens in the main actions stream.



The final Effect for loading users from an external Api looks like -

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



Lets assume a scenario where an effect has to show a notication message. the message will be dependent on the type of operation. If we create an effect to display a notification based on certain action. In this case, we can use action metadata to get the require message.

The action would be like

```typescript
export const opSuccess = createAction(
 '[profile] operation success',
 props<{message: message}>()
);
```

Also this effect will be required to return any action so we will set `dispatch:false`.

```typescript
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




there could be scenarios where the lastest state is required in the effect. In that case,

Rxjs`withLatestFrom`operator can be used to provide it.

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
             //further computation.
        )
)
```



## Register the effects

Effects can be registed in the app module or seperately in feature modules.

```typescript
EffectsModule.forRoot([AppEffects]);
//OR
EffectsModule.forFeature([ProfileFeatureEffects]);
```






