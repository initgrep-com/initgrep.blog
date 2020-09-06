# NgRx statement management in angular app - quick tutorial

NgRx provides reactive state management for angular application. It is the redux implementation developed specifically for angular applications and provides rxjs observable API .

#### TLRD;

`Actions` represents the unique events in the application.

`Reducers` are pure functions which react to events to perform state transitions.

`Selectors` are pure functions that return a state or compose a slice of state.

`Effects` are services that listen to observable of every action and perform a side-effect by reacting to an action of specific type and may or may not return a new action.

Before we go ahead, Make sure you have a filestructure as below:

```bash
 _app 
    |──store
        |_ app.actions.ts
        |_ app.effects.ts
        |_ app.reducer.ts
        |_ app.selectors.ts
```

*This structure is for the illustration purpose. During this post, we will be aggregating the code in the above files under **store**  folder*

- `app.actions.ts` file will contain the NgRX actions

- `app.effects.ts `file will contain the NgRx effects 

- `app.reducer.ts` file will contain the `State` design and its intialization and reducer functions

- `app.selectors.ts` will contain the NgRx selectors.

## State

The state represents a large object which contains the data of the application.

Let's assume, our demo appliction requires user data to - 

- show a list of users 

- show the details of a specific user by its id.

To design the state of user account, we can safely assume that the state should contain an array of users. lets call this state as `ProfileFeatureState`.  

below are the few steps we should follow:

##### Design the State.

```typescript
/** User modal */
export interface User {

  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

/** Address Modal */
export interface Address {

  id: number;
  streeet: string;
  city: string;
  state: string;
  country: string;
  zip: number;
}
/** the modals should ideally be in their own ts file**/

export interface ProfileFeatureState {
  users: User[];
  addresses: Address[];
}
```

##### Initialize the State

 Both the `users`  and `addresses` would be initally  `null` as  they would not contain any data.

```typescript
export const initialState: ProfileFeatureState = {
  users: null,
  addresses: null
};
```

Before we move ahead - please note the  `ProfileFeatureState` is part of the global state of the application. Lets call our application state as `AppState`  and store it under `profile` key.

```typescript
interface AppState{
    profile: UserFeatureState,
    //..other features here
}
```

At this point, `app.reducer.ts` file should look like below:

```typescript
/*app.reducer.ts*/

/** User modal */
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

/** Address Modal */
export interface Address {
  id: number;
  streeet: string;
  city: string;
  state: string;
  country: string;
  zip: number;
}

export interface ProfileFeatureState {
  users: User[];
  addresses: Address[];
}

export const initialState: ProfileFeatureState = {
  users: null,
  addresses: null
};

export interface AppState {
  profile: ProfileFeatureState;
}
```

Lets move ahead and design our actions.

## Actions:

Actions represent events in the application. They may trigger a state transition or  trigger a side-effect in `NgRx Effect` services.

```typescript
interface Action{
    type:string
    //optional metadata properties
}
```

The `Action` interface contains a required property `type`. `Type `identifies the action. Actions can also contain optional metadata. *More about it later*

NgRx provides `createAction` method to easily create the actions. Lets go ahead and create some actions. The first param is mandatory and presents the `type` . The second parameter is optional `props` method. `props`method is used to provide additional metadata to the action.

```typescript
//file: app.actions.ts
export const loadUsers = createAction(
  '[profile] load users'
);
export const addUsers = createAction(
  '[profile] add users',
  props<{ users: User[] }>()
);

export const createUser = createAction(
  '[profile] create user',
  props<{ user: User }>()
);

export const addUser = createAction(
  '[profile] add user',
  props<{ user: User }>()
);

export const loadAddresses = createAction(
  '[profile] load addresses'
);
export const addAddresses = createAction(
  '[profile] add addresses',
  props<{ addresses: Address[] }>()
);

export const createAddress = createAction(
  '[profile] create address',
  props<{ address: Address }>()
);

export const addAddress = createAction(
  '[profile] add address',
  props<{ address: Address }>()
);

export const logClick = createAction(
  '[profile] log click',
  props<{ value: string }>()
);
```

 

##### The below actions are related to loading, creating and adding the users to the state.

- `loadUsers` Action will be dispatched when the app requires to load the users from remote server.

- `addUsers` action will be dispatched when the users are fetched from remote server. This action also contains a payload in the form of `User[]` . this array will contain the latest fetched users.

- `createUser` action will be dispatched when a new user is created and needs to saved to remote server. it is contains the metadata in the form of `User`. 

- `addUser` action will be dispatched when a new user is saved successfully in the remote server. The metadata  presents the new `User` created.

##### The below actions are related to loading,creating and adding the users to the state.

- `loadAddresses` Action will be dispatched when the app requires to load the addresses from remote server.

- `addAddresses` action will be dispatched when the addresses are fetched from remote server. This action also contains a payload in the form of `Address[]` . this array will contain the latest fetched users.

- `createAddress` action will be dispatched when a new address is created and needs to be savedto remote server. it is contains the metadata in the form of `Address`.

- `addAddress` action will be dispatched when a new user is saved successfully in the remote server. The metadata presents the new `User` created.

- `log` action will be dispatched whenever a log should be printed to console. Its metadata contains string`value`to be logged.

> Actions represent the events and not the commands or operations . There could be one command/operation generating many types of Actions. For example: If we create a new user, this operation can generate Actions such `[Account] user created` or `[Account] user creation failed` .

***OK --***   we have designed the state and we have created the actions. Time to dive into creating reducers.

## NgRx Reducer -

Reducers help the transition of the state based on the latest action dispatcted. `reducers` pure functions and perform all the changes to state in an immutable manner.

**NgRx** provides `createReducer` function to create reducers. 

```typescript
function createReducer<S, A extends Action = Action>(initialState: S, ...ons: On<S>[]): ActionReducer<S, A>;
```

It takes `initialState` as the first param and  `any` number of `on` functions.  the `On` functions map the action to the *reducer state transtion*

 Lets go to `app.reducer.ts ` file and create the reducer functions.

```typescript

const theReducer = createReducer(
  initialState,
  on(AppActions.addUsers, (state, { users }) => ({
    ...state,
    users: [...users]
  })),
  on(AppActions.addUser, (state, { user }) => ({
    ...state,
    user: [...state.users, { ...user }]
  })),
  on(AppActions.addPosts, (state, { posts }) => ({
    ...state,
    posts: [...posts]
  })),
  on(AppActions.addPost, (state, { post }) => ({
    ...state,
    posts: [...state.posts, { ...post }]
  }))
);
```

`createReducer` function  maps many actions returns an `ActionReducer` object.  Each action handles state transtion immutably.

- `addUsers` action creates a new Users array and assigns it to users in `ProfileFeatureState`

- `addUsers` action copies the existing users in state and adds the newly created user to it and finally assigns it back to users in `ProfileFeatureState`.

- `addPosts`action creates a new Posts array and assigns it to users in`ProfileFeatureState`

- `addPost` action copies the existing users in state and adds the newly created user to it and finally assigns it back to users in `ProfileFeatureState`.

## Create ActionReducerMap

```typescript
function profileFeatureReducer
(state: ProfileFeatureState = initialState, action: Action) {
  return theReducer(state, action);
}

export const AppActionReducerMap: ActionReducerMap<AppState> = {
  profile: profileFeatureReducer
  // ... other feature go here

};
```

> **Note:**  The `profileFeatureReducer` function is necessary as [function calls are not supported](https://angular.io/guide/aot-compiler#function-calls-are-not-supported)  in the **View Engine AOT compiler.** It is no longer required if you use the **default Ivy AOT compiler (or JIT)**

`AppActionReducerMap` map contains the mapping for `profile` feature . It can have mappings for many app sepecific feature states. You can  also register feature states seperately in their own module.  You do not necessarily have to create an `ActionReducerMap` seperately. It makes registeration of States easier and provides get better type intellisence .

At this point, our `app.reducer.ts` file should look like :

```typescript
/** app.reducer.ts **/
export interface ProfileFeatureState {
  users: User[];
  posts: Post[];
}

export const initialState: ProfileFeatureState = {
  users: null,
  posts: null
};

export interface AppState {
  profile: ProfileFeatureState;
}

const theReducer = createReducer(
  initialState,
  on(AppActions.addUsers, (state, { users }) => ({
    ...state,
    users: [...users]
  })),
  on(AppActions.addUser, (state, { user }) => ({
    ...state,
    user: [...state.users, { ...user }]
  })),
  on(AppActions.addPosts, (state, { posts }) => ({
    ...state,
    posts: [...posts]
  })),
  on(AppActions.addPost, (state, { post }) => ({
    ...state,
    posts: [...state.posts, { ...post }]
  }))
);


function profileFeatureReducer(state: ProfileFeatureState = initialState, action: Action) {
  return theReducer(state, action);
}

export const AppActionReducerMap: ActionReducerMap<AppState> = {
  profile: profileFeatureReducer
};
```

## 

## Register the App State

Once the reducer is created, it has to be registered in the app Module . 

The state can be registered using one of the two options:



- **Register Root state**
  
  ```typescript
  StoreModule.forRoot({ AppActionReducerMap })
  /** or **/
  StoreModule.forRoot({ profile: profileFeatureReducer })
  ```
  
  `StoreModule.forRoot()` takes `ActionReducerMap` as an argument. The map contains  `key` and `ActionReducer` Object returned by `createReducer` function. 
  
  [register Root Reducer]()
  
  

- **Register each feature state seperately -**
  
  Feature states are similar to root states but they represent the state of specific features of an application. Typically, each feature should be contained in its own module. The root state is a large object and feature states register as additional keys and Objects in that object.
  
  ```typescript
  StoreModule.forFeature({ profile: profileFeatureReducer })
  ```

        I have created an example of registering the feature states in their own module. You can check         it out here.
        [register feature reducers]()



## NgRx Selectors -

Selectors return  part of the state. The state is a large object where feature states are stored as a `key-value` pair. The key to the feature state can be used to obtain the feature state.

`Selectors` are pure functions and they select a slice of store state.  selectors function provide [**memoization** ](https://en.wikipedia.org/wiki/Memoization)among other features.

 

Selectors can be created using two ways.

1. ##### Using `store.select` -
   
   Ngrx store provide `select` method to select a state.  Using the select method, you can select a piece of the state by providing the key as a `string` and it returns an observable.
   
   ```typescript
   constructor(private store: Store<AppState>) {} 
   
   profile$ = this.store.select('profile');
   ```
   
   we injected the `store ` in constructor and provide the type as `AppState` . To select the profile, we called the `store.select` and provided `profile` key.
   
   Although this is the easiest option. The `createSelector`  method is the recommended approach as it provides better type checking in typescript.
   
   

2. #### Using `createSelector or createFeatureSelector` functions -
   
   `createSelector `function is used to create a selector and return a slice of state.
   
   There are few steps to retrieve the slice of state using `createSelector` function.
   
   
   
   ```typescript
   // (1) : select profile
   export const selectProfile = (state: fromApp.AppState) => state.profile;
   
   // (2): return the users from profile state
   export const selectUsers = createSelector(
     selectProfile,
     (state: fromApp.ProfileFeatureState) => state.users
   );
   
   //(3) : in the service or component
   constructor(private store: Store<fromApp.AppState>) { }
    //select users from store
    users$ = this.store.pipe(select(fromSelectors.selectUsers));
   
   ```
   
   1. select the profile from state.
   
   2. create a selector to fetch the users from profile
   
   3. use `store.pipe` and provide `select` method as argument with associate selector to be fetched.
   
   
   
   we can also compose state from multiple pieces of the state. In the below example, we fetch the user and posts by the user's `id` . `props` is used to select a piece of state based on data that isn't available in the store. 
   
   ```typescript
   export const selectUserWithPosts = createSelector(
     selectUsers,
     selectPosts,
     (users: User[], posts: Post[], props: { id: number; }) => {
         //select user w.r.t ID

       const selectedUser = users?.find(user => user.id === props.id);
       //select posts for user using id

       const usersPosts = posts?.filter(post => post.userId === props.id);
       //return the user and associated posts

       if (!!usersPosts) {
         return { user: { ...selectedUser }, posts: [...usersPosts] };
       }
       return null;
     }
   );
   ```
   
   **select the state**
   
   ```typescript
   
     constructor(private store: Store<fromApp.AppState>) { }
     //select users from store
     users$ = this.store.pipe(select(fromSelectors.selectUsers));
     //select user and its posts from the store where user's id == 1

     usersPosts$ = this.store.pipe(select(fromSelectors.selectUserWithPosts, { id: 1 }));
   ```
   
   



## NgRx Effects -

Before you go ahead, I would suggest you to have a clear understanding of [side-effects](https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect)

> A [side effect](http://en.wikipedia.org/wiki/Side_effect_%28computer_science%29) refers simply to the modification of some kind of state - for instance:
> 
> - Changing the value of a variable;
> - Writing some data to disk;
> - Enabling or disabling a button in the User Interface.

        *src: <u>[https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect](https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect)</u>*

A few examples would of side effects would be `http` calls to remote server since it is an asynchronous method or UI interactions.



NgRx effect is a service which isolates the side effects from the components. Effects at its core are `injectable` services which listen to a stream of events. If an event matches or a described event, it performs an asynchonous or synchonous operation and may return another event without cancelling the event stream.

Before we move ahead , lets create  a file named `app-remote.service.ts`  and add few method to fetch the users and posts. 

```typescript

const USERS_PATH = 'https://jsonplaceholder.typicode.com/users';
const POSTS_PATH = 'https://jsonplaceholder.typicode.com/posts';

@Injectable({
  providedIn: 'root'
})
export class AppRemoteService {


  constructor(private httpClient: HttpClient) { }

  /** 1) - fetch users from the remote server */
  remoteUsers$ = this.httpClient
    .get<User[]>(USERS_PATH)
    .pipe(map(response => response), take(1));

  /** 1) - fetch posts from the remote server */
  remotePosts$ = this.httpClient
    .get<Post[]>(POSTS_PATH)
    .pipe(map(response => response), take(1));

  /** create a user in remote server  */
  createUser$ = (user: User) => this.httpClient
    .post<User>(USERS_PATH, user).pipe(take(1));

  /** create a post in remote server  */
  createPost$ = (post: Post) => this.httpClient
    .post<Post>(POSTS_PATH, post).pipe(take(1))
}
```

Effects are created in similar way as angular services are created. They are decorated with `@injectable()` decorater.



```typescript
//app.effects.ts

@Injectable()
export class AppEffects {

  constructor(
    private action$: Actions,
    private remoteService: AppRemoteService
  ) { }


  loadUsers$ = createEffect(() => this.action$.pipe(
    ofType(AppActions.loadUsers),
    mergeMap(() => this.remoteService.remoteUsers$

      .pipe(
        map(users => AppActions.addUsers({ users })),
        catchError(error => {

          console.log('error in load users ', error);
          return of(error);
        })
      )),
  ));

  loadPosts$ = createEffect(() => this.action$.pipe(
    ofType(AppActions.loadPosts),
     mergeMap(() => this.remoteService.remotePosts$

      .pipe(
        map(posts => AppActions.addPosts({ posts })),
        catchError(error => {
          console.log('error in load users ', error);
          return of(error);
        })
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

  createPost$ = createEffect(() => this.action$.pipe(
    ofType(AppActions.createPost),
    mergeMap((action) => this.remoteService.createPost$(action.post)
      .pipe(
        map(post => AppActions.addPost({ post })),
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
