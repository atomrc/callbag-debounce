# Callbag debounce

Debounce operator for [Callbag](https://github.com/callbag/callbag)

Can for example be used to:

- trigger on pause in keyboard input
   - Example: show autocomplete suggestions only after you stop typing (a best practice)
 - detect start or end of scrolling activity
   - Example: for pausing animations, or run an expensive calculations only when not scrolling
 - reshape double or multiple click events into a single event.
   - Example: a Like or Reload button that should not react more than once even if you double click it

In some cases you might want a lossy or lossless throttle callbag instead.
[Compare debounce and throttle](http://demo.nimius.net/debounce_throttle/)

## Install

    npm i callbag-debounce

## Example code

Debounces the `scroll` event and runs the `expensiveFunction` only when there is a 60ms pause.

```javascript
const { fromEvent, forEach, pipe } = require("callbag-basics");
import { debounce } from "callbag-debounce";

pipe(
  fromEvent(document, "scroll"),
  debounce(60),
  forEach(expensiveFunction)
);
```

## Changelog

### 4.0.0 (21/06/2021)

BREAKING CHANGE:

- Last value is flushed even if the stream is receiving a terminate signal before the value has been debounced (fixes [#12](https://github.com/atomrc/callbag-debounce/pull/12))

Before

```js
pipe(
  of(42),
  debounce(1000),
  subscribe(console.log)
)
// Terminates without logging anything
```

After

```js
pipe(
  of(42),
  debounce(1000),
  subscribe(console.log)
)
// logs 42
// Then terminates
```

### 3.0.0 (05/03/2021)

BREAKING CHANGE:

- Timer is cleared when stream is terminated by sink (see [#13](https://github.com/atomrc/callbag-debounce/pull/13))

### v2.1.0 (05/03/2018)

- `error` (`t === 2 && d !== undefined`) signals are sent right away (previously they were delayed according to the `wait` parameter);
- `complete` (`t === 2 && d === undefined`) signals are sent when the last value is debounced (previously they were debounced according to the `wait` parameter).

### v2.0.0 (01/03/2018)

codebase migrated to TypeScript.
The module needs to be imported via a named import

```javascript
import { debounce } from "callbag-debounce";
```

previously

```javascript
import debounce from "callbag-debounce";
```
