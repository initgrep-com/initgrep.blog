---
layout: post
bannercolor: light-green accent-3
title: Deep Dive into React Hooks
date: 2024-01-27
meta: In this blog post, we take a deep dive into React Hooks, exploring the concept and structure of the Hooks API. We examine all the inbuilt hooks in React and learn how to write custom hooks. Follow along as we provide various scenarios with code examples.
excerpt: In this blog post, we take a deep dive into React Hooks, exploring the concept and structure of the Hooks API. We examine all the inbuilt hooks in React and learn how to write custom hooks. Follow along as we provide various scenarios with code examples.
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

In this blog post, we will take a deep dive into **React Hooks**, a powerful feature introduced in React 16.8. Hooks allow developers to use state and other React features without writing a class. They provide a way to reuse stateful logic, making it easier to write and maintain React components.

## The Concept & Structure of Hooks API

The Hooks API is a set of functions that allow you to add state and other React features to functional components. It consists of two main types of hooks:

1. **State Hooks**: These hooks allow you to add state to functional components. The most commonly used state hook is the `useState` hook. It takes an initial state value and returns an array with the current state and a function to update it. Here's an example:

```javascript
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
```

2. **Effect Hooks**: These hooks allow you to perform side effects in functional components. The most commonly used effect hook is the `useEffect` hook. It takes a callback function and runs it after every render. Here's an example:

```javascript
import React, { useState, useEffect } from 'react';

const DataFetcher = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data ? (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
```

## Inbuilt Hooks in React

React offers some commonly used inbuilt hooks that cover various functionalities. Here are a few of them:

- `useState`: Adds state to functional components.
- `useEffect`: Performs side effects in functional components.
- `useContext`: Accesses the value of a React context.
- `useReducer`: Manages state with a reducer function.
- `useRef`: Provides a mutable ref object.

## Writing Custom Hooks

In addition to the inbuilt hooks, you can also write your own custom hooks to encapsulate reusable logic. Custom hooks follow the convention of using the `use` prefix in their names. Here's an example of a custom hook that manages form input state:

```javascript
import { useState } from 'react';

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: handleChange
  };
};

const Form = () => {
  const nameInput = useFormInput('');
  const emailInput = useFormInput('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit form logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" {...nameInput} placeholder="Name" />
      <input type="email" {...emailInput} placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
};
```

