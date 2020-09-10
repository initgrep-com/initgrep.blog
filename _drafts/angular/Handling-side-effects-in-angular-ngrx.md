## Ngrx Effects - Handle side-effects in angular apps

A [side effect](http://en.wikipedia.org/wiki/Side_effect_%28computer_science%29) refers simply to the modification of some kind of state - for instance:

- *Changing the value of a variable;*

- *Writing some data to disk;*

- *Enabling or disabling a button in the User Interface.*

*src: <u>[https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect](https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect)</u>*



## Pure Components

A pure component essentially has an immutable input, renders the data in UI, and produces the  events as ouput. These components are essentially dumb and most of the computations are done outside of it. A pure component has a single responsibilty similar to *pure functions*. 

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
  loadUsers(){
      //handle the subscription here
      this.remoteService.users$.subscrible(
          users => this.localUsers = users;
      );
  ```
  
  ```html
  <div class="user-container" *ngIf="localUsers">
      <app-user *ngfor="let user of localUsers" [inputUser]="user">
  </div>
  ```

       *you could also directly access the  `users$` observable using `async `pipe*



The above solution will work without  any issues. But if you notice carefully, the component is directly handling side-effects.



## NgRx effects into the play

NgRx effects solves this problem by taking away the responsibilty to handle the side-effects from components.  Thus, allowing for pure components. 

NgRx effects  are long running services that listen to an observable stream of *all* actions dispatched. If an Action matches , it performs a side-effect and returns another Action back to Action Stream. 

> *NgRx Effects may not always dispatch a new action upon completion of a side-effect.*



## Installation

```bash
# angular CLI 6+
ng add @ngrx/effects@latest

# < 6
npm install @ngrx/effects --save
```

## Implementation

Lets setup a service which  contains methods to communicate to remote server.

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

  /** 3) save a new user  */

  saveUser$ = (user: User) => this.httpClient

    .post<User>(USERS_PATH, user).pipe(take(1));

  /** 4) save a new post  */

  savePost$ = (post: Post) => this.httpClient

    .post<Post>(POSTS_PATH, post).pipe(take(1))

}

```




