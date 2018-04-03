const test = require("tape");

const pipe = require("callbag-pipe");
const forEach = require("callbag-for-each");
const fromIter = require("callbag-from-iter");
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
    forEach(() => {})
  );

  source.emit(2, "error");

});

test("it should send completion right away if no value debounced", t => {
  t.plan(1);

  const source = mock("sources", function () {}, true);

  let timeStart: number;
  const debounceValue = 10;
  pipe(
    source,
    debounce(debounceValue),
    s => (start, sink) => {
      if (start !== 0) return;
      s(0, (st, d) => {
        if (st === 2) {
          const exeTime = new Date().getTime() - timeStart;
          return t.ok(exeTime < debounceValue);
        }
        sink(st, d);
      })
    },
    forEach(() => {})
  );

  // emit a value
  source.emit(1, "data");
  // emit the completion once the value has been debounced
  setTimeout(() => {
    timeStart = new Date().getTime()
    source.emit(2);
  }, debounceValue + 1)

});

test("it should send completion after the last emission", t => {
  t.plan(1);

  const source = mock("sources", function () {}, true);

  const timeStart = new Date().getTime();
  const debounceValue = 50;
  pipe(
    source,
    debounce(debounceValue),
    s => (start, sink) => {
      if (start !== 0) return;
      s(0, (st, d) => {
        if (st === 2) {
          const exeTime = new Date().getTime() - timeStart;
          return t.ok(exeTime >= debounceValue);
        }
        sink(st, d);
      })
    },
    forEach(() => {})
  );

  source.emit(1, "event");
  source.emit(2);

});


test("it should with pullable source", t => {
  t.plan(2);
  const actual = []

  const timeStart = Date.now();
  const debounceValue = 1000;

  pipe(
    fromIter([1, 2, 3]),
    debounce(debounceValue),
    s => (start, sink) => {
      if (start !== 0) return;
      s(0, (st, d) => {
        if (st === 2) {
          const exeTime = Date.now() - timeStart;
          t.ok(exeTime >= debounceValue);
          t.equals(actual.length, 0);
        }
        sink(st, d);
      });
    },
    forEach((value) => {
      actual.push(value);
    }),
  );
});
