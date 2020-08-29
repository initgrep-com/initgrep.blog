# NgRX statement management in angular app - quick tutorial



NgRx framework provides  reactive state management for angular applications. 

#### TLDR;

`Action` represents the unique events in the application.

 `Reducers` are pure functions which react to events to perform a state transitions.

`Selectors` are pure functions that return a state or compose a slice of state.

`Effects` are  services that listen to observable of every action and perform a side-effect by reacting to an action of specific type and returns a new action.





- project setup

- Fetch data using some test apis using HttpClient

- create different actions

- create effects for side -effects such asynchronous http calls

- create reducer to manage data transitions

- create selectors

- implment Ngrx Entity to simplify reducer creation

- use input Entity adapter selectors



## Project Setup

```bash
ng new ngrx-angular-demo
ng add @ngrx/store@latest
ng add @ngrx/effects@latest
ng add @ngrx/entity@latest
ng g s app-remote --skipTests
ng g s app --skipTests
touch src/app/user.modal.ts
mkdir src/app/store
touch src/app/store/app.actions.ts
touch src/app/store/app.reducer.ts
touch src/app/store/app.effects.ts
touch src/app/store/app.selectors.ts


```

our project structure would look like below:

```bash
src
├───app
│   │   app-remote.service.ts
│   │   app.component.html
│   │   app.component.scss
│   │   app.component.spec.ts
│   │   app.component.ts
│   │   app.module.ts
│   │   app.service.ts
│   │   user.modal.ts
│   │
│   └───store
│           app.actions.ts
│           app.effects.ts
│           app.reducer.ts
│           app.selectors.ts      

```

 



SInce we will be fetching users from  an API, lets have an interface in place for a user.

```typescript
export interface User {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    avatar: string
}
```

In order for us to proceed, we will fetch data from [reqres test  server](https://reqres.in/api/users).  Two operations will be done

1. fetch users `GET: /users`

2. create a new user `POST: /users`

lets go to `app-remote.service` and create methods to fetch users and create a new user. you would need to import `HttpClientModule` in your project.  ref to [HttpClientModule docs]([https://angular.io/guide/http](https://angular.io/guide/http)



```typescript
/** base API path*/
const USER_PATH = 'https://reqres.in/api/users';

@Injectable({
  providedIn: 'root'
})
export class AppRemoteService {

  constructor(private httpClient: HttpClient) { }

  /** fetch users from the remote server */

  remoteUsers$ = this.httpClient

    .get<{ data: User[] }>(USER_PATH)
    .pipe(map(response => response.data), take(1));

  /**  create a user in remote server  */

  createUser$ = (user: User) => this.httpClient
    .post<User>(USER_PATH, user).pipe(take(1));

}
```

Our setup is done. 


before we start. lets have a look at the architechture of NgRx store:****

**diagram here**



## Describe the state.

The state represents a large object which contains which contains the data of the application.

It is ideal to think about the proper data structures which will compose an application state.



In our demo app, the state represents the `{users: User[]}`. Every new User created will be added to this array.

s.

Lets go to `app.reducer.ts`

```typescript
//app.reducer.ts
export interface State { 
   users: User[];
}

export const initialState: State = {
    users: null
};
```

`State` interface desribes the structure of the application state and the `initalState` provides an intial value to the state. In our case, the users array would be `null `initially.

we will get back to this file and create `reducers` . lets first decide on the type of events we are intersted in .

## NgRx action:

###### what are Actions?

Actions represent events in the system. it can be an event to load the data, or click of a button or START or END of an operation.

```typescript
interface Action{
    type: string,
    //optional metadata
    [key:string]:any
}
```

the above Action interface consists of  one mandatory member which is `type` . `type` represents an action. It is specified as `[source] Event name`. 

For example:

```typescript
{
    type: '[profile] add users',
    users: User[]
}
```

The above code descibes an action whose type suggests that `profile` module/component dispatched the event `load users`.  It also carries  `Users[]` array as the metadata .



###### How to write an Action:

`createAction` method is used to create an action. It takes `type` and `props` method as parameters. `props` defines the additional metadata.



Lets head to the `app.actions.ts` file and add the below actions

```typescript
//app.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from '../user.modal';

export const loadUsers = createAction(
    '[profile] load users'
);
export const addUsers = createAction(
    '[profile] add users',
    props<{ users: User[] }>()
);
export const createUser = createAction(
    '[profile] add user',
    props<{ user: User }>()
);
```

In the above snippet, `loadUsers` action will be dispatched when app  has to load the users.

`addUsers` action will be dispatched to intimate reducers to transtion the `user` state from  empty to `user[]`. `createUsers` action will be dispatched when a new user has to be created.

if you have noticed, the actions are descriptive and provide a clear message as to what it should **obey** ~~change the word later~~



> **`NgRx effects`** provides an injectable service named `Actions` . It provides access to stream of all actions dispatched after the latest state transition. 



## Reducer

Reducers help the transition of the state based on the latest action dispatcted. They are essentially pure functions and perform all the changes to state in an immutable manner.



###### creating reducers -

Below is our complete `app.reducer.ts` file

```typescript
export interface State {
  users: User[];
}

export const initialState: State = {
  users: null
};

const theReducer = createReducer(
  initialState,
  on(AppActions.addUsers, (state, { users }) => ({
    ...state,
    users: [...users]
  })),
  on(AppActions.addUser, (state, { user }) => ({
    ...state,
    user: [...state.users, { ...user }]
  }))
);

/** Note: The exported reducer function is necessary as function calls are not supported the View Engine AOT compiler. It is no longer required if you use the default Ivy AOT compiler (or JIT).*/

export function appReducer(state: State = initialState, action: Action) {
  return theReducer(state, action);
}
```

NGRX provides `createReducer` function to create a reducer function which handles the state change. its first param is the `initalState` and other parameters is set of `on` functions.

the `on's` describe map the action(s) to the state change.

In the example above -

- `addUsers` action triggers a state change from empty `[]` to users fetched from remote server.

- `addUser` action adds to the existing state one more user.  
  
  

It is important to note that the changes to the existin state should be immutable. The spread operator `...` copies all the properties of existing object into a new object and creates a new reference. Hence the state changes are immutable. If you are using complex objects or Typescript clases, you could use liberaries like `loadsh` to clone or deepClone the Objects.

###### register reducers in the module.

Inside the `app.module.ts`, we will have import the `StoreModule` and provide our reducer function.

```javascript
imports: [
    StoreModule.forRoot({ profile: fromApp.reducer })
]
```

###### select



## write ngRx effects

before writing the ngrx effects, it is important to understand what kind of side effects are present in the app. On a very trivial look, it would be the http requests. However, the side-effects could also be UI interactions, User clicks on something. 

You may think, The component can handle it itself. yes, the component should handle the `click` event but not what should be done on the click event. We could load a set of new users on the click event or we could simply check the cache of users first and if it is not present in the cache, then we may want to load it from remote server . To keep the components clean and testable, we should ideally seperate all the side-effects from the component and keep it in a seperate service.



Hence, the birth of NgRx effects. 

NgRx effect is a service which isolates the side effects from the components. Effects at its core are `injectable` services which listen to a stream of events. If an event matches or a described event, it performs an asynchonous or synchonous operation and returns another event without cancelling the event stream.

Effects are created in similar way as angular services are created. They are decorated with `@injectable()` decorater.

Lets go to `app.effects.ts` file and create effects

- load the users from the remote sytem implemented in remoteService

- create a new user
  
  

```typescript
@Injectable()
export class UserFeatureEffects {

  constructor(
    private action$: Actions,
    private remoteService: AppRemoteService
  ) { }



  loadUsers$ = createEffect(() => this.action$.pipe(
    ofType(AppActions.loadUsers),
    mergeMap(() => this.remoteService.remoteUsers$
      .pipe(
        map(users => AppActions.addUsers({ users })),
        catchError(error => of(error))
      )),
  ));

  createUser$ = createEffect(() => this.action$.pipe(
    ofType(AppActions.createUser),
    mergeMap((action) => this.remoteService.createUser$(action.user)
      .pipe(
        map(user => AppActions.addUser({ user })),
        catchError(error => of(error))
      )),
  ));

  logClick$ = createEffect(() => this.action$.pipe(
    ofType(AppActions.logClick),
    tap((action) => console.log(`logClick effect => ${action.value}`))
  ),
    { dispatch: false });

}
```

- `loadUsers$` effect  looks for  the Action `loadUsers` and loads the users from remote server. Once the users are loaded, it dispatches the action of type`addUsers` . `addUsers` action also carries additional metadata in the form of `Users[]` .

- `createUser$` effect looks for the Action `createUser` . The `createUser`action carries the additional metadata in the form of `User` . Upon recieving of the action, it calls the`createUser` method which creates a new user in remote server and return the created User. Once the operation is complete, it dispatches the `addUser` action which also carries additional metadata in the form of  `User`

- `logClick$` effect listens to `logClick` action. it only logs the action value and does not dispatch any action. `{ dispatch: false }` specifies that this effect is not dispatching any action. this is particularly useful when we only want to navigate or perform logging w.rt an `Action`.










