export function debounce(timeout: number) {
  return (source: any) => (start: number, sink: any) => {
    if (start !== 0) return;
    let timeoutId: number;
    source(0, (t: number, d: any) => {
      if (t === 1) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => sink(1, d), timeout);
      }
      else sink(t, d);
    });
  };
}
