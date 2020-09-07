# NgRx statement management in the angular app

NgRx provides reactive state management for the angular application. It is the redux implementation developed specifically for angular applications and provides RxJs observable API.

#### TLDR;

`store` is an implementation of redux state management...
`state` is an immutable data structure that is a single source of truth. It stores the state of the whole application.
`Actions` represent the unique events in the application which may or may not lead to a state transition.
`Reducers `are pure functions that react to Actions to perform state transitions.
`Selectors `are pure functions that return, derive, or compose a slice of the state.



## Prerequisites -

- you should know how to develop single-page applications using angular.

- You should have a basic understanding of redux architecture.

- you should have a fair knowledge of `RxJs` Observable API and various operators.



To begin with, let us have a look at an example file structure. Although not a recommendation, a file structure like below would be helpful to split up each feature of `NgRx `state management in your app. I usually replicate the same structure in each feature module.

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

The state represents an immutable object that contains the state of an application. It is readonly, so every state transition will return a new state rather than modifying the existing state. The Application state contains one or more feature states.

Similar to a `Js` object, the application state contains `key-value` pairs where the  `key`is a `string `representing the feature state and the `value `represents the feature state object. The state related to a feature module is referred to as `feature state` and it is part of the `Root state` of the application.



### Design the State

A typical app will have many feature modules. Each feature module will be consuming specific kinds of data. As such there could be many `feature states` . Let us assume, we have a blog app that has a feature module called `profile`. The profile module requires data related to users and the posts of users.



To design the state, we can assume that the state required for the profile module should contain lists of users and posts. Let's call the profile state as `ProfileFeatureState`.

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

##### The below actions are related to loading,creating and adding the Posts to the state.

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
  
  

> *The [...] <code>spread operator</code> copies the properties of the object and returns a new object. It only performs the shallow copying and does not copy the nested structures. You should always consider a better alternative if you are dealing with a state that contains nested data structures. Liberaries like <strong>lodash</strong> provide methods to clone nested structures.*



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

> *It is not necessary to create an `ActionReducerMap`. You can directly provide the mapping  in `StoreModule.forRoot({key: ActionReducer})`while registering the reducer in app.module.ts.  You can also seperately register the feature state in the feature module. I prefer creating the `ActionReducerMap `seperately as it provides a better type checking in Typescript.*



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

- **Register each feature state seperately -**
  
  Feature states are similar to root states but they represent the state of specific features of an application. Typically, each feature should be contained in its own module. The root state is a large object and feature states register as additional keys and Objects in that object.
  
  ```typescript
  StoreModule.forFeature({ profile: profileFeatureReducer })
  ```

        I have created an example for [registering the feature states]() in their own module. 
  

## NgRx Selectors -

The state is a large object where feature states are stored as a `key-value` pair. The key to the feature state can be used to obtain the feature state. `Selectors` are pure functions and they select a slice of store state.  selector functions provide [**memoization** ](https://en.wikipedia.org/wiki/Memoization)among other features such as portability and better testability.

Selectors can be created using two ways

#### Using `store.select` -

Ngrx store provides `select` method to select a state.  Using the `select `method, you can select a piece of the state by providing the key as a `string` and it returns an observable.

```typescript
constructor(private store: Store<AppState>) {} 

profile$ = this.store.select('profile');
```

*we injected the `store ` in constructor and provided the type as `AppState` . To select the profile, we called the `store.select` and provided `profile` key.*

Although this is the easiest option. The `createSelector`  method is the recommended approach.

#### Using `createSelector` functions -

`createSelector `function is used to create a selector and returns a slice of state.  

There are few steps to retrieve the slice of state using `createSelector` function.



1. **select the profile from state.**
   
   ```typescript
   export const selectProfile = (state: fromApp.AppState) => state.profile;
   ```

2. **create a selector to fetch the users from profile**
   
   use selector for a single peice of state.
   
   ```typescript
   export const selectUsers = createSelector(
    selectProfile,
    (state: fromApp.ProfileFeatureState) => state.users
    );
    
   ```
   
   use a selector for mulitple peices of the state.
   
   ```typescript
   export const selectUserWithPosts = createSelector(
    selectUsers,
    selectPosts,
    (users: User[], posts: Post[], props: { id: number; }) => {
       //select user w.r.t ID
       const selectedUser = users?.find(user => user.id === props.id);
       //select posts for user using id
       const usersPosts = posts
               ?.filter(post => post.userId === props.id);
                   //return the user and associated posts
                  if (!!usersPosts) {
                 return { 
                         user: { ...selectedUser }, 
                         posts: [...usersPosts] 
                        };
          }
          return null;
     }
    );
   ```
   
   > *Similarly, you can use `createFeatureSelector` to select the slices of feature state*

3. **use `store.pipe` and provide `select` method as argument with associate selector to be fetched.**
   
   ```typescript
   
    users$ = this.store.pipe(select(fromSelectors.selectUsers));
   ```




