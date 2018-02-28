const test = require("tape");

const pipe = require("callbag-pipe");
const forEach = require("callbag-for-each");
const mock = require("callbag-mock");

import { debounce } from "./src/debounce";

test("it should debounces a listenable source", t => {
  const timeoutValues = [0, 1, 2, 6, 16];
  const expected = [2, 6, 16];
  t.plan(expected.length);

  const source = mock("sources", true);

  pipe(
    source,
    debounce(2),
    forEach((value) => t.equals(value, expected.shift()))
  );

  timeoutValues.forEach(timeout => {
    setTimeout(() => source.emit(1, timeout), timeout);
  });

});
