---
layout: post
bannercolor: light-green accent-3
title: How to use built-in react hooks with examples
date: 2024-01-27
meta: Learn how to use built-in React hooks like useState, useReducer, useContext, useRef, useEffect, useMemo, and useCallback with examples. Understand their usage in various scenarios, and master the art of leveraging React hooks for efficient state management and side effects handling in your applications.
excerpt: Learn how to use built-in React hooks like useState, useReducer, useContext, useRef, useEffect, useMemo, and useCallback with examples. Understand their usage in various scenarios, and master the art of leveraging React hooks for efficient state management and side effects handling in your applications.
category: react
comments: true
author: code whiz
twitter: 
facebook: 
github: 
image: /assets/images/react.jpg
categories:
    - react
    - javascript
    - typescript
    - all
---
 &nbsp;

In React, hooks are functions that let you use state and other React features without writing a class. They are introduced in React 16.8 to enable developers to use state and other React features in functional components.

Here, we will explore various built-in React hooks and provide examples of their usage.

## useState

The `useState` hook is a basic hook that allows functional components to manage local state.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
    </div>
  );
}
```

## useReducer

The `useReducer` hook is an alternative to `useState` that is more suitable for managing state objects that contain multiple sub-values.

```jsx
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increase Count</button>
    </div>
  );
}
```

## useContext

The `useContext` hook is used to consume the context that was created using `React.createContext`.

```jsx
import React, { useContext } from 'react';

const MyContext = React.createContext('defaultValue');

function MyComponent() {
  const value = useContext(MyContext);
  return <p>Context Value: {value}</p>;
}
```

## useRef

The `useRef` hook returns a persistent reference to a DOM element.

```jsx
import React, { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return <input ref={inputRef} />;
}
```

## useEffect

The `useEffect` hook is used to perform side effects in function components.

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  return <p>Timer Count: {count}</p>;
}
```

## useMemo

The `useMemo` hook is used for memoizing expensive calculations so that they are not re-computed on every render.

```jsx
import React, { useMemo } from 'react';

function MemoExample({ a, b }) {
  const memoizedValue = useMemo(() => {
    // Expensive calculation based on 'a' and 'b'
  }, [a, b]);

  return <p>Memoized Value: {memoizedValue}</p>;
}
```

## useCallback

The `useCallback` hook returns a memorized version of the callback function that only changes if one of the dependencies has changed.

```jsx
import React, { useState, useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent handleClick={handleClick} />
    </div>
  );
}

function ChildComponent({ handleClick }) {
  return <button onClick={handleClick}>Increment Count</button>;
}
```

These are the various built-in React hooks with examples showcasing their usage in different scenarios. 
