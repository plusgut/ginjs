# plusnew [![Build Status](https://api.travis-ci.org/plusnew/plusnew.svg?branch=master)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew)

This Framework is built, because we believe that having typesafety and good debuggability is key.
Why another framework? Because plusnew puts the Developer-Expierence first, and cares strongly about maintanability.

Plusnew keeps the *magic* as little as possible, and puts explicity first.
E.G. when you write a line of code which changes the state, the dom will change immediately. This is important for predictability and testability.

## Component
Components in plusnew just need a name and a render-function.
The render-function gets called when a new instance of that component is created.

When props from the parent or stores are changing, the render-function does not get called again. But only a subset that you can define with a closure.

### Component-Types
#### Function-Factory

```ts
import plusnew, { component, Props } from 'plusnew';

type props = { value: string };

export default component(
  // ComponentName for debuggability enhancements
  'ComponentName',
  // The render-function which gets called at initialisation
  // and gets a Observer-Component which delivers the properties from the parent
  (Props: Props<props>) =>
      <>
        <span>some static content</span>
        <Props>{props =>
          // in props.value is the value you got from your parent-component
          // this render-function gets called each time when the parent gives you new properties
          <div>{props.value}</div>
        }</Props>
      </>
);
```

#### Class

```ts
import plusnew, { Component, Props } from 'plusnew';

type props = { value: string };

export default class AppComponent extends Component<props> {
  // ComponentName for debuggability enhancements
  static displayName: 'ComponentName';
  // The render-function which gets called at initialisation
  // and gets a Observer-Component which delivers the properties from the parent
  render(Props: Props<props>) {
    return (
      <>
        <span>some static content</span>
        <Props>{props =>
          // in props.value is the value you got from your parent-component
          // this render-function gets called each time when the parent gives you new properties
          <div>{props.value}</div>
        }</Props>
      </>
    );
  }
}
```

### Props
The props-values aren't given to you directly, but as an "observer-component".

This component expects a render-function as a child. This function will be called each time a prop changes.
This way you have more control of what will be selected for rerendering.

## Stores

Stores are used to persist your state and inform the components when the state changed.
They consist of the initialStateValue and a reducer function.

The reducer function gets called, when a new action gets dispatched.
This reducer gets the current state of the store and the action which just got dispatched. The new state will be the reducers return value.

The reducer function is optional. When it is not set, the dispatched value will be the new state of the store.

Each store has an Observer-Component, which expects a render-function as a child.
This render-function gets called whenever a store changes it's state.

```ts
import plusnew, { component, store } from 'plusnew';

const INITIAL_COUNTER_VALUE = 0;

export default component(
  'ComponentName',
  () => {
    const counter = store(INITIAL_COUNTER_VALUE, (previousState, action: number) => previousState + action);

    return (
      <div>
        <button
          onclick={(evt) => {
            evt.currentTarget; // Typescript knows that this element is a HTMLButtonElement, because of context
            counter.dispatch(1)
           }}
        />
        <button
          onclick={(evt) => counter.dispatch(2)}
        />
        <counter.Observer>{state =>
          // This function is the only part which gets executed on a state change
          <div>{state}</div>
        }</counter.Observer>
      </div>
    );
  },
);
```

## Helper-Components
### Portal
With portals you can render elements outside of your normal tree, whereever you want.

```ts
import plusnew, { component, Portal } from 'plusnew';

export default component(
  'ComponentName',
  () =>
    <Portal target={document.getElementById('somewhere') as HTMLElement}>
      <div>your element is appended inside the #somewhere element</div>
    </Portal>,
);
```

### Animate
The Animate-Component can take care of dom-elements which were mounted and of dom-elements to be unmounted.
When a dom-element gets created the according elementDidMount or elementWillUnmount gets called, with the dom-element as a parameter.

Same goes for dom-elements which will get unmounted. Simply return a resolved Promise when the animation is done and you want the dom-element to actually be deleted.

Note: Dom-Elements inside Dom-Elements will not trigger the callbacks, only the most outer dom-elements will trigger the callback.

```ts
import plusnew, { component, Animate, store } from 'plusnew';

export default component(
  'ComponentName',
  () => {
    const show = store(true);

    return (
      <Animate
        elementDidMount={(element) => {
          // For example you can call the Element.animate function
          // https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
          element.animate([{ opacity: '0' }, { opacity: '1' }], { duration: 3000 })
        }}
        elementWillUnmount={(element) => {
          // either return undefined, to delete the element immediately or a promise
          // e.g. https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished
          return element.animate([{ opacity: '1' }, { opacity:  '0' }], { duration: 3000 }).finished;
        }}
      >
        <show.Observer>{state =>
          // When this button gets created it calls the elementDidMount
          // when it gets deleted the elementWillUnmount gets called beforehand 
          state === true && <button onclick={() => show.dispatch(false)}>Remove me :)</button>
        }</show.Observer>
      </Animate>
    );
  },
);
```

### Async
The Async-Component is used for displaying asynchronous content.
Return as a promise, and it will show the loading content, until the promise got resolved.

For example, you can implement that a dom element gets created after a period of time, or you can lazyload another module and display it when it got loaded.
The given Promise should get resolved with an JSX-Element you want to show.

Note: it is necessary that the promise gets resolved and not rejected, it is recommended to catch your own promise.

```ts
import plusnew, { component, Async } from 'plusnew';

const lazyModule = () => import('path/to/lazy/module')
                           .then(module => <module.default />)
                           .catch(() => <span>Could not load the module</span>)

export default component(
  'ComponentName',
  () =>
    <Async
      pendingIndicator={<span>Loading asynchronously a module</span>}
    >
      {lazyModule}
    </Async>
);
```

### Idle
This component is for displaying expensive but lowpriority content.
The children of this component will be displayed when the browser is in idle
or the application is signaling that it is urgent now.

```ts
import plusnew, { component, Idle } from 'plusnew';
import ExpensiveComponent from './ExpensiveComponent';

export default component(
  'ComponentName',
  () =>
    <Idle urgent={false}>
      <ExpensiveComponent /> {/* component will not be displayed immediately */}
    </Idle>,
);
```

### Try
The Try-Component is for handling errors.
When an error occured in the render function, the catch-function will be executed and the return value will be displayed.
Be aware that every subcomponent of a try-component catches all exceptions in the render functions.

```ts
import plusnew, { component, Try } from 'plusnew';

export default component(
  'ComponentName',
  () =>
    <Try
      catch={() => <span>Error happened</span>}
    >
      {() => throw new Error('something unexpected happened')}
    </Try>
);
```
