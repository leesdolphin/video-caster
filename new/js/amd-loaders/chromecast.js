/* eslint no-underscore-dangle: ["error", { "allow": ["__onGCastApiAvailable"] }]*/
define(() => {
  let cachedApiPromise;

  function injectChromeCastScript(onError) {
    const s = document.createElement('script');

    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    s.onError = onError;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  function createApiPromise() {
    return new Promise((resolve, reject) => {
      let timeout;
      let rejectTimeout;
      let resolved = false;

      function timer() {
        if (window.chrome && window.chrome.cast) {
          clearTimeout(rejectTimeout);
          resolve();
          resolved = true;
        } else {
          timeout = setTimeout(timer, 50);
        }
      }
      function rejectionTimer() {
        if (!resolved) {
          reject(new Error('Failed to load ChromeCast library within timeframe.'));
          resolved = true;
        }
      }
      if (window.chrome && window.chrome.cast) {
        resolve();
        resolved = true;
      } else {
        injectChromeCastScript((err) => {
          clearTimeout(timeout);
          clearTimeout(rejectTimeout);
          reject(err);
          resolved = true;
        });
        timeout = setTimeout(timer, 1);
        rejectTimeout = setTimeout(rejectionTimer, 7000);

        window.__onGCastApiAvailable = (loaded, errorInfo) => {
          clearTimeout(timeout);
          clearTimeout(rejectTimeout);
          if (resolved) {
            return;
          }
          if (loaded) {
            resolve();
          } else {
            reject(errorInfo);
          }
          resolved = true;
        };
      }
    });
  }

  function getApiPromise() {
    if (!cachedApiPromise) {
      cachedApiPromise = createApiPromise();
    }
    return cachedApiPromise;
  }

  return {
    load(name, req, onload) {
      req(['domReady'], domReady =>
        domReady(() =>
          getApiPromise().then(() => {
            const cc = window.chrome.cast;
            if (name.length === 0 || name === '/') {
              onload(cc);
            } else {
              let parts;
              if (name.indexOf('.') !== -1) {
                parts = name.split('.');
              } else if (name.indexOf('/') !== -1) {
                parts = name.split('/');
              } else {
                parts = [name];
              }
              let currentPart = cc;
              let currentPath = 'window.chrome.cast';
              for (const partName of parts) {
                currentPart = currentPart[partName];
                currentPath = `.${partName}`;
                if (!currentPart) {
                  // Oops, the current thing is not valid. Bail now.
                  onload.error(new Error(`'${currentPath}' does not exist.`));
                  return;
                }
              }
              onload(currentPart);
            }
          }).catch(onload.error),
        ),
      );
    },
  };
});
