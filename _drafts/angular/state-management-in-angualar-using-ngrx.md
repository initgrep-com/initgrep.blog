# NgRX statement management in angular app - quick tutorial



NgRx framework provides  reactive state management for angular applications. 

#### TLDR;

`Action` represents the event in the application.

 `Reducers` are pure functions which react to events to perform a state transitions.

`Effects` are a long running services that listen to observable of every action and perform a side-effect by reacting to an action of specific type and returns a new action.





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

```

our project structure would look like below:

```bash
src
├───app
│       app-remote.service.ts
│       app.component.html
│       app.component.scss
│       app.component.spec.ts
│       app.component.ts
│       app.module.ts
│       app.service.ts
│       user.modal.ts
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



## NgRx action:

###### what are Actions?

Actions represent events in the system. it can be an event to load the data, or click of a button or start of an operation or end of an operation.

```typescript
interface Action{
    type: string,
    //optional metadata
    [key:string]:any
}
```

`type` represents an action. It is specified as `[source] Event`. 

For example:

```typescript
{
    type: '[profile] add users',
    users: User[]
}
```

The above code descibes an action whose type suggests that `profile` module generated the event `load users`.  It also carries  `Users[]` array as the metadata .



###### How to wrinting Actions:


