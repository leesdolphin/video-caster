/* global require:true, requirejs:false */

const config = {
  packages: [
    {
      name: 'crypto-js',
      location: '../node_modules/crypto-js',
      main: 'index',
    },
    {
      name: 'immutable',
      location: '../node_modules/immutable/dist/',
      main: 'immutable.min',
    },

  ],
};

if (typeof requirejs === 'function') {
  requirejs.config(config);
} else {
  require = config; // eslint-disable no-unused-var
}
