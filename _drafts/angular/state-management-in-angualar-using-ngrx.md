###### NgRx framework is a Reactive state management for angular.

This tutorial will help you to quickly --



- **setup ngrx in angular app**

- **implement ngrx store**
  
  - **create actions**
  
  - **create reducers**

- **create side effects**

- **fetch data using selectors**

- **create effects to handle side effects**



---

## Project setup

Before we start, Let me quickly explain our example app for the tutorial. To get you started quickly,  I have provided  below all the commands to generate the similar structure.  you can also  checkout the complete project [stackblitz](https://stackblitz.com/github/igagrock/angular-redux/tree/v1.0?)

 The app has

-    Three(3) components -
  
  - `AppComponent` - required to bootstrap the app 
  
  - `UsersComponent`- shows the list of users .
  
  - `UserComponent` - shows the details of a single user

- Two(2) services:
  
  - `UserService` to handle all the store operations such as selecting data or dispatching actions
  
  - `UserRemoteService` to handle the remote API calls using `HttpClient`
    
    

The app contains three routes -

- `/` - home route

- `/users` - points to `UsersComponent`

- `/users/id` - points to `UserComponent`







Below are the commandst to generate the above structure along with required dependencies.

It may or may not apply to you depending on the angular/angular CLI versions.

```bash
# applicable to angular v10.0.6 or above

# install angular CLI
npm install -g @angular/cli 

#create the angular app using angular CLI. Give any name you like
ng new ngrx-demo

#go to the project directory
cd ngrx-demo

#install ngRx store
ng add @ngrx/store@latest

#install ngrx effects
ng add @ngrx/effects@latest

#install ngRx entity
ng add @ngrx/entity@latest

#create users component
ng g c users --skipTests

#create user component inside users component folder
ng g c users/user --skipTests

#create userService 
ng g s users/user --skipTests

#create userRemoteService - this will have all the http methods to fetch remote data
ng g s users/user-remote --skipTests

#create user.modal.ts. It will have an interface representing user data
touch src/app/users/user.modal.ts

#create store related dir/files for app Module

$ mkdir src/app/store
$ touch src/app/store/app.reducer.ts

#create store related dir/files for users

$ mkdir src/app/users/store
$ touch src/app/users/store/user-feature.reducer.ts
$ touch src/app/users/store/user-feature.actions.ts
$ touch src/app/users/store/user-feature.effects.ts
$ touch src/app/users/store/user-feature.selectors.ts

#add HttpClientModule to App.module.ts imports array
import { HttpClientModule } from '@angular/common/http';
imports{
    ...
    HttpClientModule
}

```



So far our app `src` directory should look like below: 

```bash
│   favicon.ico
│   index.html
│   main.ts
│   polyfills.ts
│   styles.scss
│   test.ts
│
├───app
│   │   app.component.html
│   │   app.component.scss
│   │   app.component.spec.ts
│   │   app.component.ts
│   │   app.module.ts
│   │
│   ├───store
│   │       app.reducer.ts
│   │
│   └───users
│       │   user-remote.service.ts
│       │   user.modal.ts
│       │   user.service.ts
│       │   users.component.html
│       │   users.component.scss
│       │   users.component.ts
│       │
│       ├───store
│       │       user-feature.actions.ts
│       │       user-feature.effects.ts
│       │       user-feature.reducer.ts
│       │       user-feature.selectors.ts
│       │
│       └───user
│               user.component.html
│               user.component.scss
│               user.component.ts
│
├───assets
│       .gitkeep
│
└───environments
        environment.prod.ts
        environment.ts

```

> To view the app structure like above:
> 
> - go to the projects src directory- `cd src`
> 
> - use `TREE /F` in windows
> 
> - use `tree -L 1` in linux



Also, `app.module.ts` file should look like

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```



---



Lets describle our user modal 

```typescript
export interface User {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    avatar: string
}
```

Now that we have a modal in place, lets go to `user-remote.service.ts` file and create the methods to `fetch` and `create` user(s)



To test the complete flow of the app, I am using the below API's to `fetch`and `create`the users

- `GET https://reqres.in/api/users` will fetch users

- `POST https://reqres.in/api/users` will add a user
  
  - `body: user`

- `GET https://reqres.in/api/users/id`



```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.modal';
import { map, take } from 'rxjs/operators'

const usersUrl = 'https://reqres.in/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserRemoteService {

  /** inject HttpClient in constructor */
  constructor(private httpClient: HttpClient) { }

  // fetch the users

  // GET: https://reqres.in/api/users
  users$ = this.httpClient.get<{ data: User[] }>(usersUrl)
    .pipe(
      map(response => response.data),
      take(1)
    );

  //fetch user by a specific id 

 // GET: https://reqres.in/api/users/id

  user$ = (id: number) => 
  this.httpClient.get<{ data: User }>(`${usersUrl}/${id}`)
    .pipe(map(response => response.data), take(1));

 

  //create a random user

  //POST: https://reqres.in/api/users

  createUser(user: User) {
    return this.httpClient.post<User>(usersUrl, user).pipe(take(1));
  }
}

```

## Implement NgRx store:

Ngrx Store contains the global state of the app.

 Think of it as a large object which contains all the state of the application. To avoid the confusion between the `data` and the `state` of app. Data refers to overall data present in data based while as `state` could be just a snapshot of it specific to a particular user 



To Implement NgRx store, we have to - 

1. design the state 

2. create actions to `load`,`save` data in store

3. create reducers to to tell NgRx, how to store and transition from one state to another. More about it later.



### Design the state

Designing of the state is always relevant to the data, the app is using.

It is similar to designing a data model for data base.

For example: in our demo app, we are working with user modal since we would be fetching users and creating new users.

Lets head to `src/app/users/store/user-feature.reducer.ts` file  and create an interface to represent a state 



```typescript
export interface State {
    users: User[];
}
```

Now, lets figure out what would be the inital value of this state before fetching any data from remote server. In that case, the app will not have any users so it would be `null`



```typescript
export const initialState: State = {
    users: null,
}
```



### Create the actions:

An `Action `in Ngrx represents an `event`. During the lifecycle of the app, the events can be triggered to *load the data from remote server* or it could be when the *user clicks a button*. 

As such, it is important to design events in such a way so that event transition required in the state of the system has a specific event to it.

Ngrx has `CreateAction` method. it takes a `type` and `props` function and returns a function. The returned function when called, returns an object of type `Action`



```typescript
interface Action {
  type: string; //represents the type of action. it should be unique
  metadata:strings // meta data associated with action
      // the props method in createAction method is used to define additional metadata
     

}
```

lets head to `user-feature.actions.ts` file and create some actions. 

```typescript
import { createAction, props } from '@ngrx/store';
import { User } from '../user.modal';

/**
 * loadUsers action is used to inform NgRx effect to load the users from remote system
 */
export const loadUsers = createAction(
    '[users] load users'
);

/**
 * addUsers action is used to Inform store to add the users to existing state
 */
export const addUsers = createAction(
    '[users] add users',
    props<{ users: User[] }>()
);

/**
 * addUser action is used to inform store to add a user to existing users state
 */
export const addUser = createAction(
    '[users] add user',
    props<{ user: User }>()
)

/**
 * createUser action informs effects to save a user in data source
 */
export const createUser = createAction(
    '[users] add user',
    props<{ user: User }>()
)

```



### Create reducer

Reducers handle the data transtions in the store. For example: when we load the users, the reducers will add these users to the store state. hence the users state will be transitioned from `null => [...users]`.Reducer function are listeners to specific actions. Based on the action, a specific transition is performed. 

> Reducers are pure functions and function synchonously. They perform immutable operations on the state such that the original state is  not modifed. Every asynchrounous task (side-effects ) should be handled inside NgRx effects. 

Reducers are created by `createReducer` function. This function take multiple arguments. the first argument is the `initial state` followed by **N** number of `action vs state transition` provided by `on` function.



lets go back to `user-feature.reducer.ts` file and create reducer function



```typescript
import { createReducer, on, Action } from "@ngrx/store"
import * as UserFeatureActions from './user-feature.actions';

export interface State {
    users: []
}
export const initialState: State = {
    users: null
}

const theReducer = createReducer(
    initialState,
    on(UserFeatureActions.addUsers, (state, { users }) => ({
        ...state,
        users: [...users]
    })),
    on(UserFeatureActions.addUser, (state, { user }) => ({
        ...state,
        users: [...state.users, { ...user }]
    }))
)

export function UserReducer(state: State = initialState, action: Action) {
    return theReducer(state, action);
}
```



 




