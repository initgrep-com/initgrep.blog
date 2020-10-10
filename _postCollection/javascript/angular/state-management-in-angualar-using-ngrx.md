---
layout: post
bannercolor: "light-green accent-3"
title: "Reactive State management in the angular - NgRx Store, actions, selectors"
date: 2020-09-15
meta: "NgRx framework provides a reactive state management in angular applications using NgRx store, NgRx Actions, NgRx reducers and NgRx selectors"
excerpt: "NgRx framework provides a reactive state management in angular applications using NgRx store, NgRx Actions, NgRx reducers and NgRx selectors"
category: angular
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: igagrock
image: rxjs-state.jpg
categories:
  - angular
  - javascript
  - typescript
  - all
---



NgRx framework helps to build reactive angular applications.

## Basic Concepts

 **NgRx store** provides reactive state management for the angular application. NgRx store is the redux implementation developed specifically for angular applications and provides RxJS observable API.

**State** is an immutable data structure that is a single source of truth for the whole application. 

**NgRx Actions** represent the unique events in the application which may be used to perform state transition or trigger side-effects.

**NgRx Reducers** are pure functions that react to `Actions `to perform state transitions.

**NgRx Selectors** are pure functions that select, derive, or compose a slice of the state.

**NgRx Effects** allow  the isolation of side-effects. 

&nbsp;

## Prerequisites -

- you have fair understanding of angular framework.

- You have a basic understanding of redux architecture.

- you  have a fair knowledge of `RxJs` Observable API and various operators.

&nbsp;

#### Table of contents

- **Installation**
- **State**
  - Design the State
  - Initialize the State
- **NgRx Actions**
- **NgRx Reducer**
  - createReducer function
  - Create ActionReducerMap
  - Register the State
- **NgRx selectors**
  - Selectors
  - createSelector function
  - String selectors.

&nbsp;

## Installation

If you already have an angular app, you can directly go to **step - 4**

```bash
# 1) install angular cli
npm install -g @angular/cli

# 2) create a demo app
ng new ngrx-angular-demo

# 3) navigate to demo app
cd ngrx-angular-demo

# 4) install ngrx store
ng add @ngrx/store@latest

# 5) run angular in dev mode
ng serve
```

&nbsp;

**To begin with**, let us have a look at an example file structure. A structure like this would be helpful to split up each feature of `NgRx `state management in your app. I usually replicate the same structure in each feature module.

```bash

    ──store
        |_ app.actions.ts
        |_ app.effects.ts
        |_ app.reducer.ts
        |_ app.selectors.ts
```

- `app.actions.ts` file will contain the `NgRX actions`

- `app.effects.ts `file will contain the `NgRx effects`.

- `app.reducer.ts` file will contain the `State` design and its initialization. it will also contain reducer function.

- `app.selectors.ts` will contain the `NgRx selectors`.

Here is the complete [project setup](https://github.com/initgrep-post-demos/ngrx-demo/tree/master/src/app/store). 

## State

The state represents an immutable object that contains the state of an application. It is read-only, so every state transition will return a new state rather than modifying the existing state. As the application grows, each feature should contain a seperate state which are part of the global app state. As such, application state contains one or more feature states.

The state is similar to `Javascript` objects. It contains the feature states as the `key-value` pairs *where the  `key` represents a feature state and the `value ` is the feature state object.*

The state related to a feature module is referred to as `feature state`.

```typescript
interface State{
    feature_1: FeatureOneState,
    feature_2: FeatureTwoState,
    feature_3: FeatureThreeState
}
```

### Design the State

Let's assume, our angular application has many feature modules. One of the feature modules is responsible for user's profile. The `profile `module is responsible for rendering the list of  `users `and the related `posts `.

To design the state, we can assume that the state required for the profile module should contain **List of users** and **List of posts**. 

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

We defined the type for `User `and `Post` and also created an interface for `ProfileFeatureState`. 

Finally, we would add `ProfileFeatureState`to applications root state -`AppState`. The `profile` key represents the `profileFeatureState`.

```typescript
interface AppState{    
    profile: UserFeatureState,    
//..other features here
}
```

### Initialize the State

Initially, the state of the application is `null `since there would be no data. As such, both the `users array` and `posts array` would be initialized to `null`.

```typescript
export const initialProfileFeatureState: ProfileFeatureState = {
  users: null,
  addresses: null
};
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

export const initialProfileFeatureState: ProfileFeatureState = {
  users: null,
  addresses: null
};

export interface AppState {
  profile: ProfileFeatureState;
}
```

 &nbsp;

{% include ads/article-ads.html %}

&nbsp;

## Actions:

NgRx Actions represent events in the application. They may trigger a state transition or  trigger a side-effect in `NgRx Effect` services.

```typescript
interface Action{
    type:string
    //optional metadata properties
}
```

The `Action `interface contains a property called `Type`. The `Type `property **identifies** the action. Actions can also contain optional `metadata`. 

 `createAction `function is used to create the actions and it returns an [ActionCreator](https://ngrx.io/api/store/ActionCreator) function.  `ActionCreator` function  when called returns an action of type `TypedAction`. Optionally, we can also supply additional metadata using [props](https://ngrx.io/api/store/props) function.

Let's go ahead and create an action for add users to `ProfileFeatureState`.

```ts
export const addUsers = createAction(
 '[profile] add users',
 props<{ users: User[] }>()
);
```

Notice the type of addusers action as `[profile] add users`. The `[profile]` represents the source of action. Also the props contains the array of users as the metadata.
 **`addUsers`** action is dispatched to indicate that the users should added to state. It will also contain `user[]` as metadata.

Similarly, we can create an action for adding posts to the feature state.

```typescript
//file: app.actions.ts

export const addPosts = createAction(
  '[profile] add posts',
  props<{ posts: Post[] }>()
);
```

*Similarly the Actions related to posts are dispatched*

> Actions represent the events and not the commands or operations .  A single command or operation may generate many types of Actions. For example: An operation which creates a new user would atleast generate Actions for *success* and *failure* such as `[profile] user created` or `[profile] user creation failed` .

&nbsp;

{% include ads/article-ads.html %}

&nbsp;

## NgRx Reducer -

Reducers are [**pure functions**](https://en.wikipedia.org/wiki/Pure_function) which perform transitions from one state to another state based on the latest action dispatched. The reducer functions do not modify the existing state, rather it returns a new state for every state transition. Hence all the reducer functions perform immutable operations.

### CreateReducer

**NgRx** provides a [createReducer](https://ngrx.io/api/store/createReducer) function to create reducers. It takes `initialState` as the first param and `any` number of `on` functions. The `on` function provide association between actions and the state changes.

*When an action is dispatched, all the reducers receive the action. The `on` function mapping determines whether the reducer should handle the action.*

`createReducer` function returns an [ActionReducer](https://ngrx.io/api/store/ActionReducer) function . ActionReducer function takes an [Action](https://ngrx.io/api/store/Action) and a [State](https://ngrx.io/api/store/State)  as input, and returns a new computed State.

Let's go ahead a create reducer which handles transitions for `ProfileFeatureState`.

```typescript
import * as AppActions from './app.actions';

const theProfFeatureReducer = createReducer(
  initialProfileFeatureState,
  on(AppActions.addUsers, (state, { users }) => ({
    ...state,
    users: [...users]
  })),
  on(AppActions.addPosts, (state, { posts }) => ({
    ...state,
    posts: [...posts]
  })),

);
```

`createReducer` function  maps many actions and returns an `ActionReducer` function.  

- `addUsers` action is **mapped** to a *function that creates a new `User` array and returns a newly computed state*.
  
  Similarly the `addPosts` action is mapped.

> *The [...] <code>spread operator</code> copies the properties of the object and returns a new object. It only performs the shallow copying and does not copy the nested structures. You should always consider a better alternative if you are dealing with a state that contains nested data structures. Libraries like <strong>lodash</strong> provide methods to clone nested structures.*

### Create ActionReducerMap

`ActionReducerMap` provides the mapping as `key-value` pairs where the `key` represents the feature name as a string and the `value` is the `ActionReducer function` returned by `createReducer` function. 

 In our case, the `ActionReducerMap` will contain `profile` as  a key and `value` as `theProfFeatureReducer`. 

```typescript
/**The profileFeatureReducer function is necessary as function calls are not supported in the View Engine AOT compiler. It is no longer required if you use the default Ivy AOT compiler (or JIT)**/

function profileFeatureReducer
(state: ProfileFeatureState = initialState, action: Action) {
  return theProfFeatureReducer(state, action);
}

/** AppActionReducer Map**/
export const AppActionReducerMap: ActionReducerMap<AppState> = {
  profile: profileFeatureReducer
  // ... other feature go here

};
```

*It is not necessary to create an `ActionReducerMap`. You can directly provide the mapping  in `StoreModule.forRoot({key: ActionReducer})`while registering the reducer in app.module.ts.  You can also separately register the feature state in the feature module. I prefer creating the `ActionReducerMap `separately as it provides a better type checking in Typescript.*

At this point, our `app.reducer.ts` file should look like :

```typescript
/** app.reducer.ts **/
export interface ProfileFeatureState {
  users: User[];
  posts: Post[];
}

export const initialProfileFeatureState: ProfileFeatureState = {
  users: null,
  posts: null
};

export interface AppState {
  profile: ProfileFeatureState;
}

const theProfFeatureReducer = createReducer(
  initialProfileFeatureState,
  on(AppActions.addUsers, (state, { users }) => ({
    ...state,
    users: [...users]
  })),
  on(AppActions.addPosts, (state, { posts }) => ({
    ...state,
    posts: [...posts]
  }))
);


function profileFeatureReducer(state: ProfileFeatureState = initialProfileFeatureState, action: Action) {
  return theProfFeatureReducer(state, action);
}

export const AppActionReducerMap: ActionReducerMap<AppState> = {
  profile: profileFeatureReducer
};
```

&nbsp;

#### Register the  State

Once the reducer is created, It should be registered in the Module . 

The state can be registered using one of the two options:

- **Register Root state**
  
  To register the global store in the application
  
  ```typescript
  StoreModule.forRoot({ AppActionReducerMap })
  ```
  
  `StoreModule.forRoot()` takes `ActionReducerMap` as an argument. The map contains  `key` and `ActionReducer` Object returned by `createReducer` function. 

- **Register each feature state separately -**
  
  Feature states are similar to root states but they represent the state of specific features of an application. Typically, each feature should be registed in its own module. 
  
  ```typescript
  StoreModule.forFeature({ profile: profileFeatureReducer })
  ```

     &nbsp;

{% include ads/article-ads.html %}

&nbsp; 

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

Similarly to create a selector function which returns `profileFeatureState` from `AppState`, we would do like

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

NgRx provides [createSelector](https://ngrx.io/api/store/createSelector) function to create selectors. It keeps track of last arguments in which the selector functions were invoked. If the arguments remain same, it simply returns the last result without doing the computation again. This provides performance benefits for selectors where computation of state is expensive.

 `createSelector` function takes up to **8** selector functions and a projector function.  The return value of all the selectors gets passed to projector function.

> *Imagine a table structure with rows and columns. **Selector**  function will select a specific **row** and the **projector** function will return the specific **column** from the selected **row**.*

We can use createSelector function to return a complete feature state or slice of it using projector function.

#### Select a Single piece of state

Let's  use `createSelector `function to return the `users` from `profileFeatureState`

```typescript
//profile selector.
export const selectProfile = (state: fromApp.AppState) => state.profile;

// user selector
export const selectUsers = createSelector(
  selectProfile,
  //projector function return users from the feature state
  (state: fromApp.ProfileFeatureState) => state.users
);

//return users from store.
users$ = this.store.select(fromSelectors.selectUsers);
```

The  `selectProfile` selector and a `projector `function is used to retrieve all the users in `ProfileFeatureState`. Since the arguments will never change, it means the computations will be done only once to get the users unless the `AppState` is modified. Hence, the memoization at the place. 

> *`createSelector` functions returns a [MemoizedSelector](https://ngrx.io/api/store/MemoizedSelector) or  [MemoizedSelectorWithProps](https://ngrx.io/api/store/MemoizedSelectorWithProps). These are  subtypes of `Selector` and `SelectorWithProps` respectively. They provide `release()` method which helps to remove the stored memoized value. A selectors  memoized value  is stored in memory indefinitely. If the value is a large object and is no longer needed. `selector.release()` can be used to remove the stored value such as `selectUsers.release()`*

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

&nbsp;

{% include ads/article-ads.html %}

&nbsp;

#### Select multiple peices of state

Now let us assume, we want to select users and its associated posts. This involves two different pieces of the profilefeature state.

```typescript
interface usersWithPosts{
    user: User,
    posts: Post[]
} 
```

 `createSelector` function can take up to **8** selector functions which means we can pass `selectUsers` and `selectPosts` selector in the createSelector function and calculate the associated posts of users.

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

*we injected Store instance in constructor of a service or a component and provided`AppState` as the  generic type.  After that, we passed the `profile` as in the input  to select the `ProfileFeatureState`*

The final `app.selectors.ts` file looks like -

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

and `app.component.ts` -

```typescript
//app.component.ts
import * as fromSelectors from './store/app.selectors';

export class AppComponent{
  constructor(private store: Store) { }

  profile$ = this.store.select(fromSelectors.selectProfile);

  users$ = this.store.select(fromSelectors.selectUsers);

  usersPosts$ = this.store.select(fromSelectors.selectUserWithPosts, { id: 1 });

  user$ = this.store.select(fromSelectors.selectUserById, { userId: 1 });
```

The next important feature of Ngrx State mangement is to isolate the[ side effects](https://rb.gy/qw946i) of the application. You can check out the post - [Handling side effects in angular applications using Ngrx](/posts/javascript/angular/handle-side-effects-in-angular-ngrx).



&nbsp;
