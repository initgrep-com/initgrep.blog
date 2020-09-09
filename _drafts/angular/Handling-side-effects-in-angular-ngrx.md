## Ngrx Effects - Handle side-effects in angular apps

A [side effect](http://en.wikipedia.org/wiki/Side_effect_%28computer_science%29) refers simply to the modification of some kind of state - for instance:

- Changing the value of a variable;

- Writing some data to disk;

- Enabling or disabling a button in the User Interface.

*src: <u>[https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect](https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect)</u>*



Before we actually create NgRx Effects, lets take  a step back and see how we would usually handle a side-effect in an Angular application. 

Let's assume, We have to load Users using an http call. Since http calls are asynchonous which means it a side-effect. So we would



- create a service and inject `HttpClient`

- create a method `loadUsers():User`  which will call the `HTTP:Get` method and return a a list of users. 
  
  ```typescript
  users$ = this.httpClient
   .get<User[]>(USERS_PATH)
   .pipe(map(response => response), take(1));
  ```

- In our component, we we will call the `loadUsers` method and render the users in UI.
  
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

       *you could also directly use access the observable using `async `pipe*



The above solution will work without  any issues. But if you notice carefully, the component is directly handling side-effects which would lead to impure components. 



NgRx effects solves this problem by taking away the responsibilty to handle the side-effects from components.  Thus, allowing for pure components. 

NgRx effects  are long running services that listen to an observable stream of *all* actions dispatched. If an Action matches , it performs a side-effect and returns another Action back to Action Stream. 

> *NgRx Effects may not always dispatch a new action upon completion of a side-effect.*



Now before we move ahead, Lets create an angular service which does an creates an http Post call to create a new user.

```typescript

```




