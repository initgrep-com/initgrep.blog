---
layout: post
bannercolor: light-green accent-3
title: React Portals - how to use them to create dialogs in react
date: 2024-02-03
meta: Learn how to use React Portals to create dialogs in React. Understand the React Portal API and best practices for creating modals and dialogs.
excerpt: Learn how to use React Portals to create dialogs in React. Understand the React Portal API and best practices for creating modals and dialogs.
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
    - all
---
 &nbsp;
# React Portals - How to Use Them to Create Dialogs in React

In this blog post, we will explore the concept of React Portals and how to use them to create dialogs in React applications. We will dive into the API of React Portals and provide a detailed code example to demonstrate the creation of modals and dialogs using portals.

## What is React Portal?

React Portals provide a way to render a child component into a different part of the DOM, outside the parent component's DOM hierarchy. This allows for creating overlays, modals, and tooltips that are not constrained by the parent component's styling or positioning.

## React Portal API

The `react-dom` package provides the `createPortal` method, which is used to create a portal. The method takes two arguments - the first being the child element to render, and the second being the target container where the child should be rendered.

## Using React Portals to Create Modals and Dialogs

Let's take a look at a simple example of how to use React Portals to create a modal dialog in React:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        {/* other content */}
        <Modal>
          <div>Hello, I'm a modal!</div>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

In the above example, we define a `Modal` component that creates a portal to render its children into a separate `div` element appended to the `document.body`. This allows us to create a modal dialog that is rendered outside of the main app's DOM hierarchy.

By utilizing React Portals, we can create flexible and reusable components such as modals and dialogs that are not constrained by the limitations of the parent components.

By understanding the React Portal API and best practices for using portals to create modals and dialogs, developers can enhance the user experience of their React applications.
