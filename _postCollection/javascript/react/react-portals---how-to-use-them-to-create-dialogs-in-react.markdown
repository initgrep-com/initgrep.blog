---
layout: post
bannercolor: light-green accent-3
title: React Portals - how to use them to create dialogs in react
date: 2024-02-03
meta: Learn about React Portals and how to use them to create dialogs in React. This blog post explains the concept of React Portals, its API, and provides a detailed code example using React functional components to create modal dialogs. Explore the usage of React Portals to enhance your React applications.
excerpt: Learn about React Portals and how to use them to create dialogs in React. This blog post explains the concept of React Portals, its API, and provides a detailed code example using React functional components to create modal dialogs. Explore the usage of React Portals to enhance your React applications.
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

React portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component. This allows for scenarios where the DOM structure of a parent component may not accommodate the desired rendering behavior for certain child components. One common use case for portals is creating dialogs, such as modal dialogs, in React applications.

## Understanding React Portals

A React portal is a feature that enables the rendering of a child component at a different position in the DOM hierarchy, ensuring that it still behaves as if it’s a child of the component that rendered it. React Portals are useful for situations where a parent component cannot accommodate the visual rendering of certain components due to CSS constraints or z-index issues.

The API for portals is provided through the `ReactDOM.createPortal(child, container)` method. The `child` parameter represents the component to render, while the `container` parameter specifies the DOM element to render the child component into.

## Creating Modal Dialogs with React Portals

To demonstrate the usage of React Portals for creating modal dialogs in React, let's consider the following example using functional components:

```jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const ModalDialog = ({ onClose }) => {
  const modalRoot = document.getElementById('modal-root');
  const modalContent = (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <p>This is a modal dialog using React Portals.</p>
      </div>
    </div>
  );
  return ReactDOM.createPortal(modalContent, modalRoot);
};

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  return (
    <div>
      <button onClick={toggleModal}>Open Modal</button>
      {showModal && <ModalDialog onClose={toggleModal} />}
    </div>
  );
};

export default App;
```

In this example, we define a `ModalDialog` component that utilizes `ReactDOM.createPortal` to render its content into a specified DOM element (`modal-root`). The `App` component manages the state for displaying the modal dialog and provides a mechanism to toggle its visibility.
