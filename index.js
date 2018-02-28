const debounce = timeout => source => (start, sink) => {
  if (start !== 0) return;
  let talkback;
  let timeoutId;
  source(0, (t, d) => {
    if (t === 0) {
      talkback = d;
      sink(t, d);
    } else if (t === 1) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => sink(1, d), timeout);
    }
    else sink(t, d);
  });
};

module.exports = debounce;
