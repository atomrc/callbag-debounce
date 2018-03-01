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

test("it should send error right away", t => {
  t.plan(2);

  const source = mock("sources", function () {}, true);

  const timeStart = new Date().getTime();
  const debounceValue = 10000;
  pipe(
    source,
    debounce(debounceValue),
    s => (start, sink) => {
      if (start !== 0) return;
      s(0, (st, d) => {
        if (st === 2) {
          const exeTime = new Date().getTime() - timeStart;
          t.ok(exeTime < debounceValue);
          return t.equals(d, "error");
        }
        sink(st, d);
      })
    },
    forEach(console.log.bind(console))
  );

  source.emit(2, "error");

});
