/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
const Tapable = require('tapable')
const ConcatMultiModule = require('./ConcatMultiModule')

function ConcatMultiModuleFactory () {
  Tapable.call(this)
}
module.exports = ConcatMultiModuleFactory

ConcatMultiModuleFactory.prototype = Object.create(Tapable.prototype)
ConcatMultiModuleFactory.prototype.constructor = ConcatMultiModuleFactory

ConcatMultiModuleFactory.prototype.create = function (context, dependency, callback) {
  callback(null, new ConcatMultiModule(context, dependency.dependencies, dependency.name))
}
