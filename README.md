# js-styler
A simple function to do all kind of CSS styling in React/JS.

## WAT?

This is yet another take on inline styles. I've been a little bit frustrated with
other implementations either because they tried to do too much or because they
didn't support the most basic cases of CSS.

This is a simple library that allows you to apply styles to React elements and
also do both **variants** and **inheritance**.

## Variants

A component will have a base style. Variants are those that `states` / `props` will make the
component look different. Those are usually implemented in CSS through `--my-class`
modifiers or pseudo-selectors like `:hover`.

## Inheritance

Depending on the context (which parent contains your component) you may want to
overwrite or add new styles to it. This is usually implemented in CSS by nesting selectors
like `ul li`. In React you can pass styles to a children with the `styles` prop.

## API

`styler` just returns a method that has to be partial applied with:

  - `component`: Usually a reference to `this`.
  - `stylesheet`: Your Javascript style declaration.
  - `variants` (optional): The definition of which non-base 
(that depend on `state` and/or `props`) styles should be applied.

Given a stylesheet like the following:

```js
stylesheet = {
  item: {background: 'white'}
}
let st = styler(this, stylesheet);

// Just select the given style
st('item'); // => {background: 'white'}

// Select the style and pass it as an object with the same key. Ideal for inheritance
st(['item']); // => {item: {background: 'white'}}

// Same than the previous one but with an arbitrary key
st({avatar: 'item'}); // => {avatar: {background: 'white'}}
```

## Full example

```js
// components/avatar.js
let styler = require('styler')
  , stylesheet;
  
stylesheet = {
  avatar: {background: 'red';}
};

Item.render = function () {
  let st = styler(this, stylesheet);
  return (<div style={st('item')}>{this.props.author[0].toUpperCase()}</div>);
};

// components/item.js
let styler = require('styler')
  , stylesheet;
  
stylesheet = {
  item: {background: 'white'}
, avatar: {display: 'none'; background: 'green'}
, __variants: {
    hover: {avatar: {display: 'inline-block'}}
  , unread: {item: {fontWeight: 'bold'}}
  }
};

Item.render = function () {
  let hover = this.state.hover
    , unread = this.props.thread.unread
    , st = styler(this, stylesheet, {hover, unread});
    
  return (
    <li style={st('item')}>
      <Avatar style={st(['avatar'])} name={this.props.thread.author} />
      {this.props.thread.subject}
    </li>
  );
};
