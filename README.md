# Callbag debounce

Debounce operator for [Callbag](https://github.com/callbag/callbag)

## Install

    npm i callbag-debounce

## Example

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

### 3.0.0 (05/03/2021)

BREAKING CHANGE:

- Timer is cleared when stream is terminated by sink (see #13)

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
