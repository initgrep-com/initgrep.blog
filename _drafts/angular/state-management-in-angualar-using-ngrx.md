# State management in angular app - ngRx







create the app using angular CLI

add users component: `ng g c users --skipTests`

add users/user component: `ng g c users/user --skipTests`

add user service to handle http requests: `ng g s users/user` 

add user service to handle http requests: `ng g s users/user-remote` - 

add user modal `user.modal.ts`

- store:   
  
  - `ng add @ngrx/store@latest`
  
  - `npm install @ngrx/store --save`

- effects

- `ng add @ngrx/effects@latest`

- `npm install @ngrx/effects --save`

- # import httpClientModule
  
  we will be using test apis from [https://reqres.in/](https://reqres.in/)
  
  - get: [https://reqres.in/api/users?](https://reqres.in/api/users?)
  
  - get UserbyId: [[https://reqres.in/api/users?]](https://reqres.in/api/users?%5D)([https://reqres.in/api/users/id](https://reqres.in/api/users/id)
  
  - post [https://reqres.in/api/users?](https://reqres.in/api/users?)
  
   

```
.
├── app
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.spec.ts
│   ├── app.component.ts
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   └── users
│       ├── user
│       │   ├── user.component.html
│       │   ├── user.component.scss
│       │   └── user.component.ts
│       ├── user.modal.ts
│       ├── user-remote.service.ts
│       ├── users.component.html
│       ├── users.component.scss
│       ├── users.component.ts
│       └── user.service.ts
├── assets
├── environments
│   ├── environment.prod.ts
│   └── environment.ts
├── favicon.ico
├── index.html
├── main.ts
├── polyfills.ts
├── styles.scss
└── test.ts

```

Statement Management in Variables:



If you are already aware about the how to  fetch the data and maintain the state in services using variables. you can skip this section and go to `statement mangement using redux` 



if you wont use a state mangement tool in angular application, you would most probably store the state in services. It works pretty fine for a smaller app. However if the application size is large and there are various types of operations performed on data. it becomes difficult to manage the state in services.

In a typical non redux state management, the state is saved in service. for example:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.modal';
import { map, tap, take } from 'rxjs/operators';

const usersUrl = 'https://reqres.in/api/users';
@Injectable({
  providedIn: 'root'
})
export class UserRemoteService {
  users: User[];

  constructor(private httpClient: HttpClient) { }


  /**
   * 1) fetch all the users from the remote server
   * 2) save the users array
   * 
   */
  users$ = this.httpClient.get<{ data: User[] }>(usersUrl)
    .pipe(
      tap(resp => {
        console.log('tap response =>', resp);

      }),
      map(response => response.data),
      //store users in users array for future use
      tap(users => this.users = users)
    );


  /** create a new user */
  createUser(user: User) {
    return this.httpClient.post<User>(usersUrl, user)
      .pipe(
        take(1)
      )
  }


}

```



In the above example, once we fetch the users from a remote server, it is stored in users member as an array.

There are few things to be noted here:

- state is tighly coupled with the http requests.

- we have to design the CRUD operations ourselves 

- there is no memoization for repeated operations.

- side effects are not seperated.



When should you use NgRx in your app:



As per the docs:

> In particular, you might use NgRx when you build an application with a lot of user interactions and multiple data sources, when managing state in services are no longer sufficient.



NgRx store is type safe, provides encapsulation for side effects.







#### Manage side effects using NgRx effects:

The component has multiple responsibilities:

- Managing the *state* of the movies.
- Using the service to perform a *side effect*, reaching out to an external API to fetch the movies
- Changing the *state* of the movies within the component.



To isolate side-effects from your component, you must create an `Effects` class to listen for events and perform tasks.

Effects are injectable service classes with distinct parts:

- An injectable [Actions](https://ngrx.io/api/effects/Actions) service that provides an observable stream of *all* actions dispatched *after* the latest state has been reduced.
- Metadata is attached to the observable streams using the [createEffect](https://ngrx.io/api/effects/createEffect) function. The metadata is used to register the streams that are subscribed to the store. Any action returned from the effect stream is then dispatched back to the [Store](https://ngrx.io/api/store/Store).
- Actions are filtered using a pipeable [`ofType` operator](https://ngrx.io/guide/effects/operators#oftype). The [ofType](https://ngrx.io/api/effects/ofType)`operator takes one or more action types as arguments to filter on which actions to act upon.
- Effects are subscribed to the [Store](https://ngrx.io/api/store/Store) observable.
- Services are injected into effects to interact with external APIs and handle streams.








