# Callbag debounce

Debounce operator for [Callbag](https://github.com/callbag/callbag)

## Install

    npm i callbag-debounce

## Example

Debounces the `scroll` event and runs the `expensiveFunction` only when there is a 60ms pause.

```javascript
const fromEvent = require("callbag-from-event");
const forEach = require("callbag-for-each");
const debounce = require("callbag-debounce");
const pipe = require("callbag-pipe");

pipe(
  fromEvent(document, "scroll"),
  debounce(60),
  forEach(expensiveFunction)
);
```
