
const path = require('path')
const fs = require('fs')
const async = require('async')

const Set = require('immutable').Set
const List = require('immutable').List
const ConcatSource = require('webpack-sources').ConcatSource
const ConcatMultiEntryDependency = require('./concat-webpack-plugin/ConcatMultiEntryDependency.js')
const SingleEntryDependency = require('webpack/lib/dependencies/SingleEntryDependency.js')
const ConcatMultiModuleFactory = require('./concat-webpack-plugin/ConcatMultiModuleFactory')

function ConcatWebpackPlugin (options) {
  this.opts = options
  // Setup the plugin instance with options...
}

ConcatWebpackPlugin.prototype.apply = function (compiler) {
  const source = new ConcatSource()
  const contextFolder = path.resolve(compiler.options.context || process.cwd())
  const target = this.opts.target

  const allFiles = Set(this.opts.files)
  const existingFiles = allFiles.filter((file) => {
    try {
      fs.statSync(path.resolve(contextFolder, file))
      return true  // file exists
    } catch (e) {
      return false
    }
  })
  const compiledFiles = allFiles.subtract(existingFiles)

  compiler.plugin('emit', function (compilation, callback) {
    source = ConcatSource()
    function getFile(file, cb) {
      compiler.fs.readFile((err, content) =>{
        if (err) {
          return cb(err)
        }
        
      })
    }
    function getModule(module, cb) {

    }
    async.parallel([
      async.parallel(existingFiles.map((fileName) => {
        return (cb) => getFile(fileName, cb)
      }).toArray()),
      async.parallel(existingFiles.map((fileName) => {
        return (cb) => getFile(fileName, cb)
      }).toArray())
    ], (err, a) => {
      const allSources = List(a[0]).concat(a[1])
    })

    compilation.assets[target] = source
    callback()
  })
  compiler.plugin('done', function () {
    console.log('Hello World!')
  })
}

module.exports = ConcatWebpackPlugin

//
//
//
//
//
//
//
//
//
//
//
//

// import _ from 'lodash'
// import path from 'path'
// import Promise from 'bluebird'
// // import writeFileToAssets from './writeFileToAssets'
// // import shouldIgnore from './shouldIgnore'
//
// /* eslint-disable import/no-commonjs */
// const globAsync = Promise.promisify(require('glob'))
// const fs = Promise.promisifyAll(require('fs-extra'))
// /* eslint-enable */
//
// const isDevServer = (compiler) => {
//   return compiler.outputFileSystem.constructor.name === 'MemoryFileSystem'
// }
//
// const getOutputDir = (compiler) => {
//   if (compiler.options.output.path && compiler.options.output.path !== '/') {
//     return compiler.options.output.path
//   }
//
//   const devServer = compiler.options.devServer
//
//   if (!devServer || !devServer.outputPath || devServer.outputPath === '/') {
//     throw new Error('CopyWebpackPlugin: to use webpack-dev-server, devServer.outputPath must be defined in the webpack config')
//   }
//
//   return devServer.outputPath
// }
//
// export default (patterns = [], options = {}) => {
//   if (!_.isArray(patterns)) {
//     throw new Error('CopyWebpackPlugin: patterns must be an array')
//   }
//
//   const apply = (compiler) => {
//     const webpackContext = compiler.options.context
//     console.log(compiler.options.entry)
//     const outputPath = getOutputDir(compiler)
//     const fileDependencies = []
//     const contextDependencies = []
//     const webpackIgnore = options.ignore || []
//     const copyUnmodified = options.copyUnmodified
//     let writtenAssets
//     let lastGlobalUpdate
//
//     lastGlobalUpdate = 0
//
//     compiler.plugin('emit', (compilation, cb) => {
//       writtenAssets = new Set()
//
//       Promise.each(patterns, (pattern) => {
//         let globOpts
//
//         if (pattern.context && !path.isAbsolute(pattern.context)) {
//           pattern.context = path.resolve(webpackContext, pattern.context)
//         }
//
//         const context = pattern.context || webpackContext
//         const ignoreList = webpackIgnore.concat(pattern.ignore || [])
//
//         globOpts = {
//           cwd: context
//         }
//
//         // From can be an object
//         if (pattern.from.glob) {
//           globOpts = _.assignIn(globOpts, _.omit(pattern.from, 'glob'))
//           pattern.from = pattern.from.glob
//         }
//
//         const relSrc = pattern.from
//         const absSrc = path.resolve(context, relSrc)
//
//         const forceWrite = Boolean(pattern.force)
//
//         return fs
//             .statAsync(absSrc)
//             .catch(() => {
//               return null
//             })
//             .then((stat) => {
//               return globAsync(relSrc, globOpts)
//                 .each((relFileSrcParam) => {
//                   let relFileDest
//                   let relFileSrc
//
//                   relFileSrc = relFileSrcParam
//
//                     // Skip if it matches any of our ignore list
//                   if (shouldIgnore(relFileSrc, ignoreList)) {
//                     return false
//                   }
//
//                   const absFileSrc = path.resolve(context, relFileSrc)
//
//                   relFileDest = pattern.to || ''
//
//                     // Remove any directory references if flattening
//                   if (pattern.flatten) {
//                     relFileSrc = path.basename(relFileSrc)
//                   }
//
//                   const relFileDirname = path.dirname(relFileSrc)
//
//                   fileDependencies.push(absFileSrc)
//
//                   // If the pattern is a blob
//                   if (!stat) {
//                     // If the source is absolute
//                     if (path.isAbsolute(relFileSrc)) {
//                       // Make the destination relative
//                       relFileDest = path.join(path.relative(context, relFileDirname), path.basename(relFileSrc))
//
//                     // If the source is relative
//                     } else {
//                       relFileDest = path.join(relFileDest, relFileSrc)
//                     }
//                   }
//
//                   // If there's still no relFileDest
//                   relFileDest = relFileDest || path.basename(relFileSrc)
//
//                   // Make sure the relative destination is actually relative
//                   if (path.isAbsolute(relFileDest)) {
//                     relFileDest = path.relative(outputPath, relFileDest)
//                   }
//
//                   return writeFileToAssets({
//                     absFileSrc,
//                     compilation,
//                     copyUnmodified,
//                     forceWrite,
//                     lastGlobalUpdate,
//                     relFileDest
//                   }).then((asset) => {
//                     writtenAssets.add(asset)
//                   })
//                 })
//             })
//       }).then(() => {
//         lastGlobalUpdate = _.now()
//       }).catch((err) => {
//         compilation.errors.push(err)
//       }).finally(cb)
//     })
//
//     compiler.plugin('after-emit', (compilation, callback) => {
//       const trackedFiles = compilation.fileDependencies
//
//       _.forEach(fileDependencies, (file) => {
//         if (!_.includes(trackedFiles, file)) {
//           trackedFiles.push(file)
//         }
//       })
//
//       const trackedDirs = compilation.contextDependencies
//
//       _.forEach(contextDependencies, (context) => {
//         if (!_.includes(trackedDirs, context)) {
//           trackedDirs.push(context)
//         }
//       })
//
//         // Write files to file system if webpack-dev-server
//
//       if (!isDevServer(compiler)) {
//         callback()
//
//         return
//       }
//
//       const writeFilePromises = []
//
//       _.forEach(compilation.assets, (asset, assetPath) => {
//           // If this is not our asset, ignore it
//         if (!writtenAssets.has(assetPath)) {
//           return
//         }
//
//         const outputFilePath = path.join(outputPath, assetPath)
//         const absOutputPath = path.resolve(process.cwd(), outputFilePath)
//
//         writeFilePromises.push(fs.mkdirsAsync(path.dirname(absOutputPath))
//           .then(() => {
//             return fs.writeFileAsync(absOutputPath, asset.source())
//           }))
//       })
//
//       Promise.all(writeFilePromises)
//         .then(() => {
//           callback()
//         })
//     })
//   }
//
//   return {
//     apply
//   }
// }
