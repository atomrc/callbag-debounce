import { Source } from "callbag";

/**
 * Debounces the given listenable source
 *
 * @param {number} wait - The number of ms to wait before letting a value pass
 * @returns {Function}
 */
export function debounce<I>(wait: number): (source: Source<I>) => Source<I> {
  return (source) => (start: number, sink: any) => {
    if (start !== 0) return;
    let timeout: NodeJS.Timeout | undefined;
    let shouldTerminate = false;
    source(0, (t: number, d: any) => {
      if (t === 0) {
        // handle talkback from sink
        sink(t, (t2: number, val: any) => {
          // cleanup when terminated by sink
          if (t2 === 2 && timeout !== undefined) {
            clearTimeout(timeout);
            timeout = undefined;
          }

          // pass all talkback to source
          d(t2, val);
        });
      } else if (t === 1 || (t === 2 && d === undefined)) {
        // t === 1 means the source is emitting a value
        // t === 2 and d === undefined means the source emits a completion
        if (t === 2) {
          if (!timeout) {
            // There is not pending value, we can terminate the stream
            return sink(t, d);
          } else {
            // We keep track that the stream should terminate after the next value is emitted
            shouldTerminate = true;
            return;
          }
        }
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          sink(t, d);
          if (shouldTerminate) {
            sink(2);
          }
          timeout = undefined;
        }, wait);
      } else {
        /*
         * nothing specific to do when the source
         * sends a t === 2 d !== undefined signal
         */
        sink(t, d);
      }
    });
  };
}
