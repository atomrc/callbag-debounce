# Callbag debounce

Debounce operator for [Callbag](https://github.com/callbag/callbag)

## Install

    npm i callbag-debounce

## Example

Debounces the `scroll` event and runs the `expensiveFunction` only when there is a 60ms pause.

```javascript
const { fromEvent, forEach, pipe } = require("callbag-basics");
const debounce = require("callbag-debounce");

pipe(
  fromEvent(document, "scroll"),
  debounce(60),
  forEach(expensiveFunction)
);
```
