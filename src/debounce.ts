/**
 * Debounces the given listenable source
 *
 * @param {number} wait - The number of ms to wait before letting a value pass
 * @returns {Function}
 */
export function debounce(wait: number): any {
  return (source: any) => (start: number, sink: any) => {
    if (start !== 0) return;
    let ask: any;
    let timeout: number | undefined;
    source(0, (t: number, d: any) => {
      if (t === 0) {
        ask = d;
      }

      if (t === 1 || (t === 2 && d === undefined)) {
        // t === 1 means the source is emitting a value
        // t === 2 and d === undefined means the source emits a completion
        if (!timeout && t === 2) {
          return sink(t, d);
        }
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          sink(t, d);
          timeout = undefined;
        }, wait);

        if (t === 1) {
          ask(1)
        }
      }
      /*
       * nothing specific to do when the source
       * sends a t === 2 d !== undefined signal
       */
      else sink(t, d);
    });
  };
}
