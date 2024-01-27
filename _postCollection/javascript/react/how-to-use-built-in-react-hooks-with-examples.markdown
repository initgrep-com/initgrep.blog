---
layout: post
bannercolor: light-green accent-3
title: How to use built-in react hooks with examples
date: 2024-01-27
meta: Learn how to effectively use built-in React hooks with examples. Understand the usage scenarios and handle edge cases for optimized development. Master the useState, useEffect, useContext, and more React hooks.
excerpt: Learn how to effectively use built-in React hooks with examples. Understand the usage scenarios and handle edge cases for optimized development. Master the useState, useEffect, useContext, and more React hooks.
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
# How to Use Built-In React Hooks

React hooks have revolutionized the way we write React components. With hooks, we can now write functional components with state and lifecycle methods, making our code more modular and easier to test. In this article, we will explore the various built-in React hooks and demonstrate their usage with code examples.

## useState

The `useState` hook is used to add state to functional components. It takes an initial state value and returns an array containing the current state and a function to update the state. Here's an example:

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

In this example, we initialize the `count` state variable to 0 using the `useState` hook. We then render the current count and a button to increment it. On each button click, we call the `setCount` function to update the count.

## useEffect

The `useEffect` hook is used to perform side effects in functional components. It accepts two arguments: a callback function that contains the side effect logic and an optional array of dependencies. Here's an example:

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <p>Time: {time}</p>;
}
```

In this example, we use the `useEffect` hook to start an interval timer that increments the `time` state variable every second. We also use the `clearInterval` function returned by `useEffect` to clean up the timer when the component unmounts.

## useContext

The `useContext` hook allows functional components to consume context values. It accepts a context object created by `React.createContext` and returns the current context value. Here's an example:

```jsx
import React, { useContext } from 'react';

const ThemeContext = React.createContext('light');

function Theme() {
  const theme = useContext(ThemeContext);

  return <p>Current theme: {theme}</p>;
}
```

In this example, we create a `ThemeContext` object with a default value of `'light'`. We then use the `useContext` hook to access the current theme value and render it.

These are just a few examples of the many built-in React hooks available. Experiment with different hooks and explore their usage scenarios to enhance your React development. Remember to handle edge cases and thoroughly test your code.
