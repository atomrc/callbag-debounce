/**
 * Debounces the given listenable source
 *
 * @param {number} wait - The number of ms to wait before letting a value pass
 * @returns {Function}
 */
export function debounce(wait: number): any {
  return (source: any) => (start: number, sink: any) => {
    if (start !== 0) return;
    let timeout: number;
    source(0, (t: number, d: any) => {
      if (t === 1) {
        // t === 1 means the source is emitting a value
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => sink(1, d), wait);
      }
      /*
       * no need to handle the t === 0 case because
       * the operator never needs to talkback to the source
       *
       * nothing specific to do when the source
       * sends a t === 2 signal
       */
      else sink(t, d);
    });
  };
}
