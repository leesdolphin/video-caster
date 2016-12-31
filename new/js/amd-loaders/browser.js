define({
  load: (name, req, onload) => {
    onload(window[name]);
  },
});
