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



To design the state of user account, we can safely assume that the state should contain an array of users. lets call this state as `UserFeatureState`.  

below are the few steps we should follow:

##### Design the State.

```typescript
interface User {

    id: number,
    email: string,
    first_name: string,
    last_name: string,
    avatar: string
}

interface UserFeatureState {

  users: User[];
}
```

##### Initialize the State

The state (`user[]`) would be `null` initially as it would not contain any data.

```typescript
const initialState: UserFeatureState = {

  users: null
};
```

Before we move ahead - please note the  `userFeatureState` is part of the global state of the application. Lets call our application state as `AppState`

```typescript
interface AppState{
    profile: UserFeatureState,
    //..other features here
}
```

At this point, `app.reducer.ts` file should look like below:

```typescript
/*app.reducer.ts*/


// user interface can also be put in a seperate file such as user.modal.ts
export interface User {

    id: number,
    email: string,
    first_name: string,
    last_name: string,
    avatar: string
}

export interface UserFeatureState {
  users: User[];
}

export const initialState: UserFeatureState = {
  users: null
};

export interface AppState {
  profile: UserFeatureState;

}
```



Lets move ahead and design our actions.

## Actions:

Actions represent events in the application. 

```typescript
interface Action{
    type:string
    //optional metadata properties
}
```

The `Action` interface contains a required property `type`. Type identifies the action. Actions can also contain optional metadata. *I will explain it in detail once we create the actions.*



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

export const log = createAction(

  '[profile] log click',
  props<{ value: string }>()
);
```



- `loadUsers` Action will be dispatched when the app requires to load the users from remote server.

- `addUsers` action will be dispatched when the users are fetched from remote server. This action also contains a payload in the form of `User[]` . this array will contain the latest fetched users.

- `createUser` action will be dispatched when a new user is created and needs to saved to remote server. it is contains the metadata in the form of `User`. this user represents 

- `addUser` action will be dispatched when a new user is saved successfully in the remote server. The metadata  presents the new `User` created.

- `log` action will be dispatched  whenever a log should be printed to console.  Its metadata contains string`value `to be logged.
  
  

> Actions represent the events and not the commands or operations . There could be one command/operation generating many types of Actions. For example: If we create a new user, this operation can generate Actions such  `[Account] user created` or `[Account] user creation failed` .



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

const userReducer = createReducer(

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
```

`createReducer` function above handles two actions. Each action handles state transtion immutably.

- `addUsers` action creates a new Users array and assigns it to users in `UserFeatureState`

- `addUsers` action copies the existing users in state and adds the newly created user to it and finally assigns it back to users in `UserFeatureState`.
  
  

> All the actions created do not necessarily handle a state transition. Some actions are used to trigger a side-effect in `NgRx Effect` services.










