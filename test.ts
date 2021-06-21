import * as test from "tape";
const mock = require("callbag-mock");

import { debounce } from "./src/debounce";

test("it should debounces a listenable source", (t) => {
  const timeoutValues = [0, 1, 2, 6, 16];
  const expected = [2, 6, 16];
  t.plan(1);

  const source = mock(true);
  const sink = mock();

  debounce(2)(source)(0, sink);

  const timeouts = Promise.all(
    timeoutValues.map((timeout) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          source.emit(1, timeout);
          resolve(undefined);
        }, timeout);
      });
    })
  );

  timeouts.then(() => {
    setTimeout(() => {
      t.deepEqual(sink.getReceivedData(), expected);
    }, 3);
  });
});

test("it should send error right away", (t) => {
  t.plan(2);

  const source = mock(true);
  const sink = mock();
  debounce(2)(source)(0, sink);

  source.emit(2, "error");
  // Sink should have received end signal
  t.equal(sink.checkConnection(), false);

  // Sink should have received the error message
  t.deepEqual(
    (sink.getMessages() as any[]).find(([t]) => t === 2),
    [2, "error"]
  );
});

test("it should send completion right away if no value is sent", (t) => {
  t.plan(1);

  const source = mock(true);
  const sink = mock();

  debounce(2)(source)(0, sink);

  source.emit(2);
  t.deepEqual(
    sink.getMessages().find(([t]) => t === 2),
    [2, undefined]
  );
});

test("it should send completion after the last emission", (t) => {
  t.plan(2);
  const source = mock(true);
  const sink = mock();

  debounce(2)(source)(0, sink);

  // emit a value
  source.emit(1, "data");
  // emit the completion once the value has been debounced
  setTimeout(() => {
    source.emit(2);
    t.deepEqual(sink.getReceivedData(), ["data"]);
    t.deepEqual(
      sink.getMessages().find(([t]) => t === 2),
      [2, undefined]
    );
  }, 3);
});

test("it should not emit after unsubscribe", (t) => {
  t.plan(1);

  const source = mock(true);
  const sink = mock();

  debounce(2)(source)(0, sink);

  source.emit(1, true);
  sink.emit(2);

  setTimeout(() => {
    t.equal(sink.getReceivedData().length, 0);
  }, 5);
});
