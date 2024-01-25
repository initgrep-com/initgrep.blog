---
layout: post
bannercolor: light-green accent-3
title: Understanding and using react context api
date: 2024-01-25
meta: Learn how to use the React Context API to solve common problems in your React applications. Understand what the Context API is, how it works, and explore different scenarios with code examples.
excerpt: Learn how to use the React Context API to solve common problems in your React applications. Understand what the Context API is, how it works, and explore different scenarios with code examples.
category: react
comments: true
author: sheikh irshad
twitter: imshykh
facebook: irshsheikh
github: irshsheik
image: /assets/images/rxjs-effects.jpg
categories:
    - react
    - javascript
    - typescript
    - all
---
 &nbsp;
# Understanding and Using React Context API

The React Context API is a powerful feature that allows you to share data between components without having to pass props through every level of the component tree. It provides a way to manage global state and solves the problem of prop drilling.

## What is Context API in React?

Context API is a part of React that enables you to share data across multiple components without explicitly passing it through props. It provides a way to create global variables that can be accessed by any component in the application.

## Problems Solved by Context API

### 1. Prop Drilling

Prop drilling occurs when you have to pass props through multiple levels of components just to reach a deeply nested component that needs the data. This can make your codebase messy and hard to maintain. Context API solves this problem by allowing you to access the data directly from any component without passing it through intermediate components.

### 2. Global State Management

Managing global state can be challenging, especially when you have multiple components that need access to the same data. Context API provides a centralized place to store and manage global state, making it easier to share data between components.

## How to Use Context API

Using Context API involves three main steps:

1. Create a Context

To create a context, you can use the `createContext` method provided by React. This method returns an object with two properties: `Provider` and `Consumer`.

```javascript
import React from 'react';

const MyContext = React.createContext();

export default MyContext;
```

2. Provide the Context

Wrap your component tree with the `Provider` component and pass the data you want to share as a prop.

```javascript
import React from 'react';
import MyContext from './MyContext';

const App = () => {
  const data = 'Hello, World!';

  return (
    <MyContext.Provider value={data}>
      {/* Your component tree */}
    </MyContext.Provider>
  );
};

export default App;
```

3. Consume the Context

To access the shared data, you can use the `Consumer` component or the `useContext` hook.

```javascript
import React, { useContext } from 'react';
import MyContext from './MyContext';

const MyComponent = () => {
  const data = useContext(MyContext);

  return <div>{data}</div>;
};

export default MyComponent;
```

## Scenarios

### Scenario 1: Theme Switcher

Let's say you have a theme switcher component that allows users to toggle between light and dark themes. You want to share the current theme across multiple components in your application. Context API can help you achieve this.

```javascript
import React, { createContext, useState } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
```

### Scenario 2: User Authentication

In a user authentication scenario, you might want to share the user's authentication status and information across different components. Context API can help you manage the user's authentication state and provide the necessary data to the components that need it.

```javascript
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
```

## Conclusion

The React Context API is a powerful tool that simplifies the process of sharing data between components. It solves the problem of prop drilling and provides a centralized way to manage global state. By understanding and using the Context API, you can write cleaner and more maintainable React applications.
