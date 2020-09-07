## NgRx Effects -

Before you go ahead, I would suggest you to have a clear understanding of [side-effects](https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect)

> A [side effect](http://en.wikipedia.org/wiki/Side_effect_%28computer_science%29) refers simply to the modification of some kind of state - for instance:
> 
> - Changing the value of a variable;
> - Writing some data to disk;
> - Enabling or disabling a button in the User Interface.

*src: <u>[https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect](https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect)</u>*

NgRx effect is a service which isolates the side effects from the components. Effects at its core are `injectable` services which listen to a stream of events. If an event matches or a described event, it performs an asynchonous or synchonous operation and may return another event without cancelling the event stream.

Before we move ahead , lets create a file named `app-remote.service.ts` and add few method to fetch the users and posts.

```typescript

const USERS_PATH = 'https://jsonplaceholder.typicode.com/users';const POSTS_PATH = 'https://jsonplaceholder.typicode.com/posts';@Injectable({  providedIn: 'root'})export class AppRemoteService {  constructor(private httpClient: HttpClient) { }  /** 1) - fetch users from the remote server */  remoteUsers$ = this.httpClient    .get(USERS_PATH)    .pipe(map(response => response), take(1));  /** 1) - fetch posts from the remote server */  remotePosts$ = this.httpClient    .get(POSTS_PATH)    .pipe(map(response => response), take(1));  /** create a user in remote server  */  createUser$ = (user: User) => this.httpClient    .post(USERS_PATH, user).pipe(take(1));  /** create a post in remote server  */  createPost$ = (post: Post) => this.httpClient    .post(POSTS_PATH, post).pipe(take(1))}
```

Effects are created in similar way as angular services are created. They are decorated with `@injectable()` decorater.

```typescript
//app.effects.ts@Injectable()export class AppEffects {  constructor(    private action$: Actions,    private remoteService: AppRemoteService  ) { }  loadUsers$ = createEffect(() => this.action$.pipe(    ofType(AppActions.loadUsers),    mergeMap(() => this.remoteService.remoteUsers$      .pipe(        map(users => AppActions.addUsers({ users })),        catchError(error => {          console.log('error in load users ', error);          return of(error);        })      )),  ));  loadPosts$ = createEffect(() => this.action$.pipe(    ofType(AppActions.loadPosts),     mergeMap(() => this.remoteService.remotePosts$      .pipe(        map(posts => AppActions.addPosts({ posts })),        catchError(error => {          console.log('error in load users ', error);          return of(error);        })      )),  ));  createUser$ = createEffect(() => this.action$.pipe(    ofType(AppActions.createUser),    mergeMap((action) => this.remoteService.createUser$(action.user)      .pipe(        map(user => AppActions.addUser({ user })),        catchError(error => of(error))      )),  ));  createPost$ = createEffect(() => this.action$.pipe(    ofType(AppActions.createPost),    mergeMap((action) => this.remoteService.createPost$(action.post)      .pipe(        map(post => AppActions.addPost({ post })),        catchError(error => of(error))      )),  ));  logClick$ = createEffect(() => this.action$.pipe(    ofType(AppActions.logClick),    tap((action) => console.log(`logClick effect => ${action.value}`))  ),    { dispatch: false });}
```
