---
layout: post
bannercolor: light-green accent-3
title: Handle side effects in react using redux-saga
date: 2024-02-11
meta: handle side effects in React using Redux-Saga. Explore basic usage, advanced concepts like parallel, sequential, concurrent and race tasks, task cancellation, and real-world scenarios.
excerpt: handle side effects in React using Redux-Saga. Explore basic usage, advanced concepts like parallel, sequential, concurrent and race tasks, task cancellation, and real-world scenarios.
category: react
comments: true
author: sheikh irshad
twitter: 
facebook: 
github: 
image: /assets/images/side-effects.png
categories:
    - react
    - javascript
    - typescript
    - all
---
 &nbsp;

Redux-Saga is a middleware library for Redux that makes side effects easier to manage and more efficient to execute. By using Redux-Saga, you can handle asynchronous operations, such as data fetching and impure interactions with the browser and external APIs, in a more organized and maintainable way.

Sagas are constructed using Generator functions, producing objects that are yielded to the redux-saga middleware. These yielded objects act as instructions for the middleware to interpret. Whenever a Promise is yielded to the middleware, the Saga is temporarily halted until the Promise is fulfilled.

More about generator functions [here...](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) 

## Setup

To get started with Redux-Saga, you'll first need to install the package via npm or yarn:


```bash
npm install redux-saga
```

Next, you'll need to create a new saga file where you'll define your sagas. Let's take a look at a basic example below:

```javascript
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchDataSuccess, fetchDataError } from './actions';
import Api from './api';

function* fetchDataSaga(action) {
  try {
    const data = yield call(Api.fetchData, action.payload);
    yield put(fetchDataSuccess(data));
  } catch (error) {
    yield put(fetchDataError(error));
  }
}

function* main() {
  yield takeEvery('FETCH_DATA_REQUESTED', fetchDataSaga);
}

export default rootSaga;
```

In this example, we define a `fetchDataSaga` that handles fetching data from an API and dispatches success or error actions based on the result. We then create a `rootSaga` that uses `takeEvery` to watch for specific actions and trigger the corresponding saga.

> Notice the `call` and `put` keywords. these are called effects. We will discuss each of them in detail.

### Create a root reducer

Let's setup root saga  so that all the saga are present in one file. It makes it easier to configure the middleware later. We will see how to do that in next steps.

```javascript
import { all } from 'redux-saga/effects';
import main from './FetchDataSaga'; // import your saga

export default function* rootSaga() {
  yield all([
    main(), // use your saga
  ]);
}

```

### Configure the middleware in redux-store
Assuming you already have a reducer and root reducer. You will need to create saga middleware, add it to middlwares and run the rootSaga

```javascript

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = configureStore({
  rootReducer, 
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

// then run the saga
sagaMiddleware.run(rootSaga)


```
 &nbsp;
## Redux Saga Effects.
Below are the various effects provided by redux saga with the usage. we will also discuss the real world scenarios in the next section.

- **call**: This effect is used to call functions, promise-returning functions, or other sagas. It helps manage the flow of synchronous and asynchronous operations by waiting for the function or saga to complete before proceeding further.
  ```javascript
  import { call } from 'redux-saga/effects';

  function* fetchData() {
    const result = yield call(api.fetchData);
    // Further logic after fetching data
  }

  ```

- **put**: This effect dispatches actions to the Redux store. It allows sagas to trigger changes in the application state by dispatching actions, leading to the execution of corresponding reducers.

  ```javascript
  import { put } from 'redux-saga/effects';

  function* exampleSaga() {
    yield put({ type: 'ACTION_TYPE', payload:{x:y} });
    // Redux store will dispatch 'ACTION_TYPE'
  }

  ```

- **take**: This effect listens for a specific action to be dispatched to the Redux store. When the specified action is detected, the saga resumes execution. It's useful for handling asynchronous operations based on certain actions.

  ```javascript
    import { take } from 'redux-saga/effects';

  function* watchAction() {
    yield take('WATCHED_ACTION');
    // Saga resumes when 'WATCHED_ACTION' is dispatched
  }
  ```

- **takeEvery** and **takeLatest**: These are helper functions that simplify the process of handling multiple occurrences of a specific action. `takeEvery` allows the saga to run each time the specified action is dispatched, while `takeLatest` ensures that only the latest occurrence is processed, canceling any previous instances.

  ```javascript
    import { takeEvery, takeLatest } from 'redux-saga/effects';

    function* handleEvery() {
      yield takeEvery('WATCHED_ACTION', workerSaga);
    }

    function* handleLatest() {
      yield takeLatest('WATCHED_ACTION', workerSaga);
    }
  ```

- **all** and **race**: These effects deal with handling multiple sagas concurrently. `all` is used to run multiple sagas concurrently and wait for all of them to complete, while `race` is used to run multiple sagas concurrently but only wait for the first one to complete.

  ```javascript
    import { all, race } from 'redux-saga/effects';

  function* rootSaga() {
    yield all([saga1(), saga2()]);
    // or using race
    yield race({ task1: call(saga1), task2: call(saga2) });
  }

  ```

- **fork** and **spawn**: These effects are used to manage the concurrency of sagas. `fork` and `spawn` both create a non-blocking fork, allowing the parent saga to continue executing without waiting for the forked saga to finish. The parent saga continues its execution regardless of the outcome of the forked task. `spawn` is similar to `fork` in that it creates a new task. However, `fork` is used to create attached forks where as `spawn` is used to create detached forks. Attached forks remain attached to their parent. that means, the parent saga will terminate only after all the attached forks are themselves terminated.

  ```javascript
  import { fork, spawn } from 'redux-saga/effects';

  function* parentSaga() {
    yield fork(childSaga);
    // or using spawn
    yield spawn(detachedSaga);
  }
  ```

- **delay**: The `delay` effect is used to introduce a delay in the execution of the saga. It's particularly useful for scenarios where you need to wait for a specific amount of time before proceeding with the next steps.

  ```javascript
  import { delay } from 'redux-saga/effects';

  function* delayedSaga() {
    yield delay(1000); // Waits for 1 second
    // Continue with the next steps
  }

  ```

- **select**: This effect is used to access the current state of the Redux store. It allows sagas to retrieve specific pieces of information from the store, making it useful for scenarios where the saga's behavior depends on the current state.

  ```javascript
  import { select } from 'redux-saga/effects';

  function* getInfo() {
    const data = yield select(state => state.someData);
    // Use the selected data in the saga
  }
  ```
 &nbsp;

## Real-World Scenarios

let’s dive into more realistic and detailed scenarios that you might encounter in app development:

### User Authentication
Effects: `take`, `call`, and `put` 

Imagine you’re building an app that requires user authentication. When a user attempts to log in, you need to make an API call to authenticate the user, then update your Redux store based on the result. Here’s how you might use Redux Saga to handle this

```javascript
import { take, call, put } from 'redux-saga/effects';
import Api from '../api';

function* loginSaga() {
  while (true) {
    const { payload } = yield take('LOGIN_REQUEST');
    try {
      const user = yield call(Api.login, payload);
      yield put({ type: 'LOGIN_SUCCESS', user });
    } catch (error) {
      yield put({ type: 'LOGIN_ERROR', error });
    }
  }
}

```
### Data fetching from multiple sources.
Effect: `all`

Suppose your app needs to fetch multiple pieces of data at the same time, like a user’s profile and their posts. You can use `all` to fetch this data in parallel

```javascript
import { all, call, put } from 'redux-saga/effects';
import Api from '../api';

function* fetchDataSaga(userId) {
  try {
    const [profile, posts] = yield all([
      call(Api.fetchProfile, userId),
      call(Api.fetchPosts, userId)
    ]);
    yield put({ type: 'FETCH_DATA_SUCCESS', profile, posts });
  } catch (error) {
    yield put({ type: 'FETCH_DATA_ERROR', error });
  }
}

```
### Non-Blocking Calls
Effect: `fork` or `spawn`

In a chat application, you might want to allow the user to send messages while simultaneously fetching new messages. fork allows you to handle these tasks concurrently

```javascript

import { fork, take, call, put } from 'redux-saga/effects';
import Api from '../api';

function* fetchMessagesSaga() {
  while (true) {
    yield take('FETCH_MESSAGES_REQUEST');
    try {
      const messages = yield call(Api.fetchMessages);
      yield put({ type: 'FETCH_MESSAGES_SUCCESS', messages });
    } catch (error) {
      yield put({ type: 'FETCH_MESSAGES_ERROR', error });
    }
  }
}

function* sendMessageSaga() {
  while (true) {
    const { payload } = yield take('SEND_MESSAGE_REQUEST');
    try {
      yield call(Api.sendMessage, payload);
      yield put({ type: 'SEND_MESSAGE_SUCCESS' });
    } catch (error) {
      yield put({ type: 'SEND_MESSAGE_ERROR', error });
    }
  }
}

function* chatSaga() {
  yield fork(fetchMessagesSaga);
  yield fork(sendMessageSaga);
}

```
### Handling Timeouts 
Effect: `race`

 If your app makes API calls, you might want to handle scenarios where the API takes too long to respond. You can use `race` to timeout the API call if it takes too long.

 ```javascript
 import { race, call, put, delay } from 'redux-saga/effects';
import Api from '../api';

function* fetchWithTimeoutSaga() {
  const { response, timeout } = yield race({
    response: call(Api.fetchData),
    timeout: delay(5000)
  });

  if (response) {
    yield put({ type: 'FETCH_SUCCESS', payload: response });
  } else if (timeout) {
    yield put({ type: 'FETCH_TIMEOUT' });
  }
}

 ```



