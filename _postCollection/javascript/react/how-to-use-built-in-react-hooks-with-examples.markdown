---
layout: post
bannercolor: light-green accent-3
title: How to use built-in react hooks with examples
date: 2024-01-27
meta: Learn how to use built-in React hooks like useState, useReducer, useContext, useRef, useEffect, useMemo, and useCallback with examples and edge cases. Enhance your understanding of React hooks and their usage scenarios.
excerpt: Learn how to use built-in React hooks like useState, useReducer, useContext, useRef, useEffect, useMemo, and useCallback with examples and edge cases. Enhance your understanding of React hooks and their usage scenarios.
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
## How to Use Built-in React Hooks

In React, hooks are functions that let you use state and other React features without writing a class. They help in managing component state and side effects. In this article, we'll explore how to use various built-in React hooks with code examples and discuss their usage scenarios and edge cases.

### useState
```javascript
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
### useReducer
```javascript
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
    </div>
  );
}
```
### useContext
```javascript
import React, { useContext, createContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value='dark'>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div>{theme}</div>;
}
```
### useRef
```javascript
import React, { useRef, useEffect } from 'react';

function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```
### useEffect
```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
### useMemo
```javascript
import React, { useMemo } from 'react';

function ExpensiveComponent({ list }) {
  const expensiveValue = useMemo(() => computeExpensiveValue(list), [list]);
  return <div>{expensiveValue}</div>;
}
```
### useCallback
```javascript
import React, { useState, useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  return (
    <div>
      <ChildComponent increment={increment} />
      <p>Clicked {count} times</p>
    </div>
  );
}

function ChildComponent({ increment }) {
  return <button onClick={increment}>Increment</button>;
}
```
By understanding and mastering these built-in React hooks, you can effectively manage state, side effects, and context in your React applications. Consider various scenarios and edge cases to leverage the full potential of these hooks in your projects, and elevate your React development skills to the next level.