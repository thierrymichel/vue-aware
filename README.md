# vue-aware

> Optimized and easy way to manage events across Vue.js components.

![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg?style=flat-square)
[![NPM version](https://img.shields.io/npm/v/thierrymichel/vue-aware.svg?style=flat-square)](https://www.npmjs.com/package/thierrymichel/vue-aware)
[![CircleCI](https://img.shields.io/circleci/project/github/thierrymichel/vue-aware/master.svg?style=flat-square)](https://circleci.com/gh/thierrymichel/vue-aware/tree/master)
[![Coverage Status](https://img.shields.io/coveralls/github/thierrymichel/vue-aware/master.svg?style=flat-square)](https://coveralls.io/github/thierrymichel/vue-aware?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![License](https://img.shields.io/badge/license-UNLICENSE-green.svg?style=flat-square)](https://github.com/thierrymichel/vue-aware/blob/master/UNLICENSE)

## Description

`vue-aware` allows your components to easily listen to "common global" events such as:

- scroll
- viewport resize
- appear on viewport
- request animation frame

Another kind of bus event?

What makes `vue-aware` special is how it manages events for you.<br>
`vue-aware` will create as **LESS** listeners as possible and **ONLY** when some components need it!<br>
Which is good performance wise…

---

## Installation

```sh
npm install --save vue-aware
```

### Import

```js
import Vue from 'vue';
import VueAware from 'vue-aware';

Vue.use(VueAware);
```

### Browser

```html
<script src="vue.js"></script>
<script src="https://unpkg.com/thierrymichel/vue-aware"></script>
```

> `vue-aware` should be auto-installed. If not, use `Vue.use(VueAware)`.

## Usage

### General

1. Simply add the `v-aware` directive to your element(s).
2. Define a handler for an event (`appear`, `raf`, `scroll`, `viewport`):

- `@[event]="handler"` or
- `v-on:[event]="handler"` or
- `v-aware="{ [event]: { callback: handler } }"`

> `callback` property have precedence over `@` or `v-on` directive…

#### Example (scroll)

```html
<div v-aware @scroll="scrollHandler"></div>
```

```html
<div v-aware v-on:scroll="scrollHandler"></div>
```

```html
<div v-aware="{ scroll: { callback: scrollHandler }}"></div>
```

### Appear

> `appear` uses the [IntersectionObserver API](http://caniuse.com/#feat=intersectionobserver). If it is incompatible with your browser support, you can [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) it.

`appear` will let you know if your element is:

- partially in viewport
- fully in viewport
- positionned on top, bottom or center of the viewport

Like `IntersectionObserver`, it accepts options:

- **root** (`HTMLElement`, default is browser viewport)
- **rootMargin** (CSS margin prop, with `%` or `px`, default is `0px 0px 0px 0px`)
- **threshold** (related to target's visibility, `number` or `number[]`, default is `[0, 1]`)

and an extra one:

- **once** (your callback is only trigger once, default `false`)

#### Example

```html
<!-- no options -->
<div v-aware @appear="appearHandler"></div>
<!-- full options -->
<div
  v-aware="{
  appear: {
    root: document.querySelector('.foo'),
    rootMargin: '-25% 0px',
    threshold:  [0, 0.25, 0.5, 0.75, 1],
    once: true,
  }}"
  @appear="appearHandler"
></div>
```

```js
export default {
  methods: {
    appearHandler(isInViewport, isFullyInViewport, position) {},
  },
};
```

### Raf (requestAnimationFrame)

Use [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to trigger your handler.<br>
There is no options.

#### Example

```html
<div v-aware @raf="rafHandler"></div>
```

```js
export default {
  methods: {
    rafHandler(delta, now) {},
  },
};
```

### Scroll

Gives you the scroll position (`x` and `y`).<br>
You can throttle or debounce it ([read more](https://css-tricks.com/the-difference-between-throttling-and-debouncing/)).

#### Example

```html
<!-- no options -->
<div v-aware @scroll="scrollHandler"></div>
<!-- full options -->
<div
  v-aware="{
  scroll: {
    throttle: 250,
    debounce: 50,
  }}"
  @scroll="scrollHandler"
></div>
```

```js
export default {
  methods: {
    scrollHandler(scrollX, scrollY) {},
  },
};
```

### Viewport

When a window resize is detected.<br>
It gives you the width and height of the viewport + ratio (width/height).<br>
You can throttle or debounce it ([read more](https://css-tricks.com/the-difference-between-throttling-and-debouncing/)).<br>
By default, it is throttled (`150ms`).

#### Example

```html
<!-- no options -->
<div v-aware @viewport="viewportHandler"></div>
<!-- full options -->
<div
  v-aware="{
  viewport: {
    throttle: 250,
    debounce: 50,
  }}"
  @viewport="viewportHandler"
></div>
```

```js
export default {
  methods: {
    viewportHandler(width, height, ratio) {},
  },
};
```

---

## How to contribute

If you want to report a bug or if you just want to request for a new feature/improvement, please **follow [those instructions](CONTRIBUTING.md) before**.

Thanks for taking time to contribute to `vue-aware` :tada: :+1:
