
const MultiModule = require('webpack/lib/MultiModule')
const RawSource = require('webpack-sources').RawSource

function ConcatMultiModule (context, dependencies, name) {
  MultiModule.call(this)
  this.context = context
  this.dependencies = dependencies
  this.name = name
  this.built = false
  this.cacheable = true
}
module.exports = ConcatMultiModule

ConcatMultiModule.prototype = Object.create(MultiModule.prototype)

ConcatMultiModule.prototype.identifier = function () {
  return 'concat ' + this.name
}

ConcatMultiModule.prototype.readableIdentifier = function () {
  return 'concat ' + this.name
}

ConcatMultiModule.prototype.source = function (dependencyTemplates, outputOptions) {
  const str = []
  this.dependencies.forEach(function (dep, idx) {
    if (dep.module) {
      str.push('undefined')
    } else {
      str.push('(function webpackMissingModule() { throw new Error(')
      str.push(JSON.stringify('Cannot find module "' + dep.request + '"'))
      str.push('); }())')
    }
    str.push(';\n')
  }, this)
  return RawSource(str)
}

ConcatMultiModule.prototype.updateHash = function (hash) {
  hash.update('raw module')
  MultiModule.prototype.updateHash.call(this, hash)
}
