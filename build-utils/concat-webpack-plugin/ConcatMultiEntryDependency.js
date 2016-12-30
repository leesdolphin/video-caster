/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const Dependency = require('webpack/lib/Dependency')

function ConcatMultiEntryDependency (dependencies, name) {
  Dependency.call(this)
  this.dependencies = dependencies
  this.name = name
}
module.exports = ConcatMultiEntryDependency

ConcatMultiEntryDependency.prototype = Object.create(Dependency.prototype)
ConcatMultiEntryDependency.prototype.constructor = ConcatMultiEntryDependency
ConcatMultiEntryDependency.prototype.type = 'concat multi entry'
