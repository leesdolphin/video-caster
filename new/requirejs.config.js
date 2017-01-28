/* global require:true, requirejs:false */

const config = {
  packages: [
    {
      name: 'crypto-js',
      location: '../node_modules/crypto-js',
      main: 'index',
    },
  ],
  paths: {
    chromecast: 'amd-loaders/chromecast',
    domReady: '../node_modules/requirejs-domready/domReady',
    idb: '../node_modules/idb/lib/idb',
  },
  shim: {
    idb: {
      init: () => window.idb,
    },
  },
};

if (typeof requirejs === 'function') {
  requirejs.config(config);
} else {
  require = config; // eslint-disable no-unused-var
}
