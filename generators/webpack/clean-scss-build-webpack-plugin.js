const fs = require('fs');
const path = require('path');
const util = require('util');

const unlink = util.promisify(fs.unlink);

class CleanScssBuildWebpackPlugin {
  static getEmittedJsFiles(assets) {
    return Object.entries(assets).reduce((emittedJsFiles, props) => {
      if (!props[1].emitted) {
        return emittedJsFiles;
      }

      return CleanScssBuildWebpackPlugin.isJsFile(props[0])
        ? emittedJsFiles.concat(props[0])
        : emittedJsFiles;
    }, []);
  }

  static getJsFilesFromCssOrScssBuild(chunks) {
    const chunksFromCssOrScss = chunks.filter(chunk =>
      CleanScssBuildWebpackPlugin.isChunkFromCssOrScss(chunk)
    );

    if (chunksFromCssOrScss.length === 0) {
      return [];
    }

    return CleanScssBuildWebpackPlugin.getJsFilesFromChunks(
      chunksFromCssOrScss
    );
  }

  static isChunkFromCssOrScss(chunk) {
    const validExtensions = ['.css', '.scss'];

    const cssOrScssModules = chunk
      .getModules()
      .filter(module =>
        validExtensions.includes(path.parse(module.rawRequest).ext)
      );

    return chunk.getNumberOfModules() === cssOrScssModules.length;
  }

  static getJsFilesFromChunks(chunks) {
    const jsFiles = chunks.map(chunk =>
      chunk.files.filter(CleanScssBuildWebpackPlugin.isJsFile)
    );

    // Flatten the array
    return [].concat(...jsFiles);
  }

  static isJsFile(file) {
    return path.parse(file).ext === '.js';
  }

  static logMessage(deletedFiles) {
    if (deletedFiles.length === 1) {
      console.log(`🔥 ${deletedFiles} is deleted`);
    } else if (deletedFiles.length > 1) {
      console.log(`🔥 ${deletedFiles.join(', ')} are deleted`);
    }
  }

  /* eslint-disable class-methods-use-this */
  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      const emittedJsFiles = CleanScssBuildWebpackPlugin.getEmittedJsFiles(
        compilation.assets
      );

      // No JS files emitted
      if (emittedJsFiles.length === 0) {
        return callback();
      }

      const uneededJsFiles = CleanScssBuildWebpackPlugin.getJsFilesFromCssOrScssBuild(
        compilation.chunks
      );

      // No JS files originated from CSS or SCSS entry
      if (uneededJsFiles.length === 0) {
        return callback();
      }

      const needsToBeRemoved = emittedJsFiles.filter(file =>
        uneededJsFiles.includes(file)
      );

      // Nothing to remove
      if (needsToBeRemoved.length === 0) {
        return callback();
      }

      return Promise.all(
        needsToBeRemoved.map(file =>
          unlink(path.join(compilation.outputOptions.path, file))
        )
      )
        .then(() => {
          CleanScssBuildWebpackPlugin.logMessage(needsToBeRemoved);
          callback();
        })
        .catch(err => console.error(err));
    });
    /* eslint-enable class-methods-use-this */
  }
}

module.exports = CleanScssBuildWebpackPlugin;
