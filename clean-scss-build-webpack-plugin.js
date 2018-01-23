const fs = require('fs');
const path = require('path');
const util = require('util');

const unlink = util.promisify(fs.unlink);

class CleanScssBuildWebpackPlugin {
  static isChunkFromCssOrScss(chunk) {
    const sourceExtensions = chunk.origins.map(origin =>
      path.parse(origin.module.userRequest).ext);

    return sourceExtensions.length === sourceExtensions.filter(ext =>
      ['.css', '.scss'].includes(ext)).length;
  }

  static getJsFilesFromChunks(chunks) {
    const jsFiles = chunks.map(chunk => chunk.files.filter(file =>
      path.parse(file).ext === '.js'));

    // Flatten the array
    return [].concat(...jsFiles);
  }

  static logMessage(deletedFiles) {
    if (deletedFiles.length === 1) {
      console.log(`🔥 ${deletedFiles} is deleted`);
    } else if (deletedFiles.length > 1) {
      console.log(`🔥 ${deletedFiles.join(', ')} are deleted`);
    }
  }

  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      const chunksFromCssOrScss = compilation.chunks.filter(chunk =>
        CleanScssBuildWebpackPlugin.isChunkFromCssOrScss(chunk));

      const uneededJsFiles = CleanScssBuildWebpackPlugin.getJsFilesFromChunks(chunksFromCssOrScss);

      Promise.all(
        uneededJsFiles.map(file =>
          unlink(path.join(compilation.outputOptions.path, file))
        ))
        .then(() => {
          CleanScssBuildWebpackPlugin.logMessage(uneededJsFiles);
          callback();
        })
        .catch(err => console.error(err))
    });
  }
}

module.exports = CleanScssBuildWebpackPlugin;
