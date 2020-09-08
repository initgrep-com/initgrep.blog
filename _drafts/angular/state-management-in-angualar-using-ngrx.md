# NgRx statement management in the angular app

NgRx provides reactive state management for the angular application. It is the redux implementation developed specifically for angular applications and provides RxJs observable API.

#### TLDR;

`store` provides state management for createing maintainable applications. 
`state` is an immutable data structure that is a single source of truth. It stores the state of the whole application.
`Actions` represent the unique events in the application which may or may not lead to a state transition.
`Reducers `are pure functions that react to Actions to perform state transitions.
`Selectors `are pure functions that return, derive, or compose a slice of the state.

## Prerequisites -

- you have developed SPA's using angular.

- You have a basic understanding of redux architecture.

- you  have a fair knowledge of `RxJs` Observable API and various operators.





**To begin with**, let us have a look at an example file structure. Although not a recommendation, a file structure like this would be helpful to split up each feature of `NgRx `state management in your app. I usually replicate the same structure in each feature module.

```bash

    ──store
        |_ app.actions.ts
        |_ app.effects.ts
        |_ app.reducer.ts
        |_ app.selectors.ts
```

- `app.actions.ts` file will contain the `NgRX `actions

- `app.effects.ts `file will contain the `NgRx `effects 

- `app.reducer.ts` file will contain the `State` design and its initialization and reducer functions

- `app.selectors.ts` will contain the NgRx selectors.



## State

The state represents an immutable object that contains the state of an application. It is read-only, so every state transition will return a new state rather than modifying the existing state. The Application state contains one or more feature states.

Similar to a `Javascript` object, the application state contains `key-value` pairs where the  `key`is a `string `and the `value ` is the feature state object. 

The state related to a feature module is referred to as `feature state` and it is part of the `Root state` of the application. 

```typescript
interface State{
    feature_1: FeatureOneState,
    feature_2: FeatureTwoState,
    feature_3: FeatureThreeState
}
```

### Design the State

A typical angular application will have many feature modules. Each feature module will be consuming specific kinds of data. As such there could be many `feature states` . 

Let us assume, we have a blog app that has a feature module called `profile`. The profile module requires data related to `users `and `posts `.

To design the state, we can assume that the state required for the profile module should contain lists of users and posts. 

Let's call the profile state as `ProfileFeatureState`.

```typescript
/** User modal */
export interface User {

  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

/** post modal **/
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}


/** the modals should ideally be in their own ts file**/

export interface ProfileFeatureState {
  users: User[];
  posts: Post[];
}
```

We created two interfaces for User and Post. We also created an interface for ProfileFeatureState.

### Initialize the State

Initially, the state of the application is `null `since there would be no data. As such, both the users and posts would be initialized to `null`.

```typescript
export const initialProfileFeatureState: ProfileFeatureState = {
  users: null,
  addresses: null
};
```

Finally, we would add `ProfileFeatureState `to applications root state -`AppState`.

```typescript
interface AppState{
    profile: UserFeatureState,
    //..other features here
}
```

At this point, `app.reducer.ts` file should look like -

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

/** Post Modal */

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
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

## Actions:

Actions represent events in the application. They may trigger a state transition or  trigger a side-effect in `NgRx Effect` services.

```typescript
interface Action{
    type:string
    //optional metadata properties
}
```

The `Action `interface contains a property called `Type`. The `Type `property **identifies** the action. Actions can also contain optional metadata. You can use the `createAction `method to easily create the actions.

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

export const loadPosts = createAction(
  '[profile] load posts'
);
export const addPosts = createAction(
  '[profile] add posts',
  props<{ posts: Post[] }>()
);

export const createPost = createAction(
  '[profile] create post',
  props<{ post: Post }>()
);

export const addPost = createAction(
  '[profile] add post',
  props<{ post: Post }>()
);

export const logClick = createAction(
  '[profile] log click',
  props<{ value: string }>()
);
 
```

**The below actions are related to loading, creating, and adding the users to the state.**

- **`loadUser`** action is dispatched to indicate that the app should load the **users** from the remote server.
- **`addUsers`** action will be dispatched after the users are fetched from the remote server. This action also contains metadata in the form of `User[]` . This array contains the latest users fetched from remote server.
- **`createUser`** action will be dispatched when a new user is created and needs to be saved to a remote server. It contains a `User` object as its metadata.
- **`addUser`** action will be dispatched when a new user is saved successfully in the remote server. The metadata contains the new user  object.

##### The below actions are related to loading,creating and adding the Posts to the state

- **`loadPOsts`** action is dispatched to indicate that the app should load the **posts** from the remote server.

- **`addPosts`** action will be dispatched after the posts are fetched from the remote server. This action also contains metadata in the form of `Post[]` . This array contains the latest posts fetched from remote server.

- **`createPost`** action will be dispatched when a new post is created and needs to be saved to a remote server. It contains a `Post` object as its metadata.

- **`addAddress`** action will be dispatched when a new post is saved successfully in the remote server. The metadata presents the new `User` created.

- `log` action will be dispatched whenever a log should be printed to console. Its metadata contains string`value`to be logged. This action doesn't trigger a state transition .

> Actions represent the events and not the commands or operations .  A single command or operation may generate many types of Actions. For example: An operation which creates a new user would roughly generate Actions for *success* and *failure* such `[Account] user created` or `[Account] user creation failed` .

## NgRx Reducer -

Reducers are [**pure functions**](https://en.wikipedia.org/wiki/Pure_function) which perform transitions from one state to another state based on the latest action dispatched. The reducer functions do not modify the existing state, rather it returns a new state for every state transition. Hence all the reducer functions perform immutable operations.

**NgRx** provides a `createReducer` function to create reducers. It takes `initialState` as the first param and `any` number of `on` functions. The `on` function maps the action to the *function that performs the immutable state transition*. When an action is dispatched, all the reducers receive the action. The `on` function mapping determines whether the reducer should handle the action.

Let's go ahead a create reducer which handles transitions for `ProfileFeatureState`.

```typescript

const profileFeatureReducer = createReducer(
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

`createReducer` function  maps many actions and returns an `ActionReducer` object.  

- `addUsers` action creates a new Users array and assigns it to users ito existing `ProfileFeatureState`

- `addUsers` action copies the existing users in state and adds the newly created user to it and finally adds all the users to existing`ProfileFeatureState`.

- `addPosts`action creates a new Posts array and assigns it to users in`ProfileFeatureState`

- `addPost` action copies the existing users in state and adds the newly created user to it and finally assigns it to users of `ProfileFeatureState`.

> *The [...] <code>spread operator</code> copies the properties of the object and returns a new object. It only performs the shallow copying and does not copy the nested structures. You should always consider a better alternative if you are dealing with a state that contains nested data structures. Libraries like <strong>lodash</strong> provide methods to clone nested structures.*

#### Create ActionReducerMap

ActionReducerMap provides the mapping as `key-value` pairs where the `key` represents the feature name as a string and the `value` is the `ActionReducer` returned by `createReducer` function.  In our case, the `ActionReducerMap` will contain `profile` as  a key and `value` as `profileFeatureReducer`. 

```typescript
/**The profileFeatureReducer function is necessary as function calls are not supported in the View Engine AOT compiler. It is no longer required if you use the default Ivy AOT compiler (or JIT)**/

function profileFeatureReducer
(state: ProfileFeatureState = initialState, action: Action) {
  return theReducer(state, action);
}

/** AppActionReducer Map**/
export const AppActionReducerMap: ActionReducerMap<AppState> = {
  profile: profileFeatureReducer
  // ... other feature go here

};
```

> *It is not necessary to create an `ActionReducerMap`. You can directly provide the mapping  in `StoreModule.forRoot({key: ActionReducer})`while registering the reducer in app.module.ts.  You can also separately register the feature state in the feature module. I prefer creating the `ActionReducerMap `separately as it provides a better type checking in Typescript.*

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



#### Register the  State

Once the reducer is created, it should be registered in the application Module . 

The state can be registered using one of the two options:

- **Register Root state**
  
  ```typescript
  StoreModule.forRoot({ AppActionReducerMap })
  /** or **/
  StoreModule.forRoot({ profile: profileFeatureReducer })
  ```
  
  `StoreModule.forRoot()` takes `ActionReducerMap` as an argument. The map contains  `key` and `ActionReducer` Object returned by `createReducer` function. 
  
  you can check [register Root Reducer]() example for a detailed example of registering the root state.

- **Register each feature state separately -**
  
  Feature states are similar to root states but they represent the state of specific features of an application. Typically, each feature should be contained in its own module. The root state is a large object and feature states register as additional keys and Objects in that object.
  
  ```typescript
  StoreModule.forFeature({ profile: profileFeatureReducer })
  ```

        I have created an example for [registering the feature states]() in their own module. 
  

## NgRx Selectors -

Selectors return a slice of application state. Selectors are pure functions and provide [memoization](https://en.wikipedia.org/wiki/Memoization) among other features such as type-safety, composition, and portability.

### Selectors

As you may recall,  **`state `** is a large object and `feature states` are stored as  `key-value` pairs. The `key `to the feature state can be used to obtain the feature state  object like `obj.key`. 

```typescript
export interface AppState{
    profile: ProfileFeatureState
}
```

If we have to select the `profileFeatureState` , we would do as `AppState.profile` and it would return the `profileFeatureState`.

Similarly to create a function which returns `profileFeatureState` from `AppState`, we would do like

```typescript
selectProfile = function(state:AppState){ return state.profile; }
```

or we could use the arrow`(=>)` functions to simplify it.

```typescript
selectProfile = (state:AppState) => state.profile;
```

That is the`selectProfile` selector. 

```typescript
//inside an angular component or service
//injec NgRx store instance 
constructor(private store: Store) { }
profile$ = this.store.select(selectProfile);
```

The store instance is injected in constructor and no generic type is mentioned. In this case, TypeScript is able to automatically infer types from the *selector function*.



**There is one more way to get the selected state from store**

NgRx `store` is an  observable and NgRx provides  *pipeable* `select` operator similar to `RxJs operators`. 

```typescript
profile$ = this.store.pipe(select(fromSelectors.selectProfile));
```



*Wait, there is more to selectors....*

***Pure functions*** *always return the same value for  same set of arguments. It means, selectors will always return the same piece of state if the argument do not change*. *Thus we could leverage this property of selectors to provide [memoization](https://en.wikipedia.org/wiki/Memoization).*



### createSelector functions

NgRx provides `createSelector`  function to create selectors. It keeps track of last arguments in which the selector functions were invoked. If the arguments remain same, it simply returns the last result without doing the computation again. This provides performance benefits for selectors where computation of state is expensive.



 `createSelector` function takes up to **8** selector functions and a projector function.  the return value of all the selectors gets passed to projector function.

> *Imagine a table structure with rows and columns. **Selector**  function will select a specific **row** and the **projector** function will return the specific **column** from the selected **row**.*



#### select single peice of state

let us  use `createSelector `function to return the `users` from `profileFeatureState`

```typescript
//profile selector.
export const selectProfile = (state: fromApp.AppState) => state.profile;

// user selector
export const selectUsers = createSelector(
  selectProfile,
  (state: fromApp.ProfileFeatureState) => state.users
);

//return users from store.
users$ = this.store.select(fromSelectors.selectUsers);
```

The  `selectProfile` selector and a `projector `function is used to retrieve all the users in `ProfileFeatureState`. Since the arguments will never change, it means the computations will be done only once to get the users unless the `AppState` is modified. Hence, the memoization at the place. 



> *`createSelector` functions returns a `MemoizedSelector` . It is a subtype of `Selector` and provides `release()` method which helps to remove the stored memoized value. A selectors  memoized value  is stored in memory indefinitely. If the value is a large object and is no longer needed. `selector.release()` can be used to remove the stored value such as `selectUsers.release()`*



Similar to selecting users, we can also select Posts from `ProfileFeatureState`.

```typescript
//profile selector.
export const selectProfile = (state: fromApp.AppState) => state.profile;

// post selector
export const selectPosts = createSelector(
 selectProfile,
 (state: fromApp.ProfileFeatureState) => state.posts
 );

//return posts from store.
posts$ = this.store.select(fromSelectors.selectPosts);
```

#### select multiple peices of state

Now let us assume, we want to select users and its associated posts as a data structure like below

```typescript
interface usersWithPosts{
    user: User,
    posts: Post[]
} 
```

we will pass `selectUsers` and `selectPosts` selector in the createSelector function and calculate the associated posts of users.

```typescript

export const selectUsersWithPosts = createSelector(
  selectUsers,
  selectPosts,
  (users: User[], posts: Post[]) => {
    return users.map(user => {
      return { 
      user: { ...user }, 
      posts: posts.filter(post => post.userId === user.id) };
    });
  });

//return usersWithPosts Observable
usersWithPosts$ = this.store.select(fromSelectors.selectUsersWithPosts);
```

*Notice how the `selectUsers` and `selectPosts`  selectors return-values are passed to the projector function.*



#### Select State using Props

Selectors can also select a piece of state based on data that is not available in the store.  we can pass `props` object to selector function. The `props `gets passed through every `selector `and `projector `function.

To explain it, lets assume, we want to select a user based on its `id`.

```typescript
export const selectUserById = createSelector(
  selectProfile,
  (state: fromApp.ProfileFeatureState, props: { userId: number }) 
  => state.users.find(user => user.id === props.userId)
);

//return the user with id == 1
user$ = this.store.select(fromSelectors.selectUserById, {userId: 1});
```

we passed the `props:{userId:number}` object to projector function. The projector function returns the user. While selecting the user from store, we passed an extra object with same type as `props` and provided the actual value. In this case, the `userId` is equal to **1**.



## String Selectors.

There is also a simple way of creating selectors by providing the key of the feature state as a parameter to `store.select` method. In this case, it is mandatory to provide a generic type to `store `instance. 

```typescript
constructor(private store: Store<fromApp.AppState>) { }

profile$ = this.store.select('profile');
```

*we injected store instance in constructor of a service and provided `AppState` as the  generic type.  After that, we directly passed the string parameter as `profile` to select the `ProfileFeatureState`*



the final `app.selectors.ts` file looks like -

```typescript
//app.selectors.ts
import * as fromApp from './app.reducer';

/** selectProfile selector */
export const selectProfile = (state: fromApp.AppState) => state.profile;

/** selectUser selector */
export const selectUsers = createSelector(
  selectProfile,
  (state: fromApp.ProfileFeatureState) => state.users
);

/**selectUserById Selector */
export const selectUserById = createSelector(
  selectProfile,
  (state: fromApp.ProfileFeatureState, props: { userId: number }) => state.users.find(user => user.id === props.userId)
);

/**selectPosts selector */
export const selectPosts = createSelector(
  (state: fromApp.AppState) => state.profile,
  (profState: fromApp.ProfileFeatureState) => profState.posts,
);

/**selectUsersWithPosts Selector */
export const selectUsersWithPosts = createSelector(
  selectUsers,
  selectPosts,
  (users: User[], posts: Post[]) => {
    return users.map(user => {
      return { user: { ...user }, posts: posts.filter(post => post.userId === user.id) };
    });
  });



```

and `app.service.ts` -

```typescript
//app.service.ts
import * as fromSelectors from './store/app.selectors';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private store: Store) { }
  

  profile$ = this.store.select(fromSelectors.selectProfile);
  
  users$ = this.store.select(fromSelectors.selectUsers);
  
  usersPosts$ = this.store.select(fromSelectors.selectUserWithPosts, { id: 1 });
  
  user$ = this.store.select(fromSelectors.selectUserById, { userId: 1 });



```


