const fs = require('fs-extra');
const path = require('path');

class DeleteBuildFilesPlugin {
  constructor(files, buildPath) {
    this.files = files;
    this.buildPath = buildPath;
  }

  apply(compiler) {
    compiler.plugin('done', () =>
      Promise.all(this.files.map(file => fs.remove(path.join(this.buildPath, file))))
        .then(() => console.log(`🔥 ${this.files.join(', ')} are deleted`))
        .catch(err => console.error(err)));
  }
}

module.exports = DeleteBuildFilesPlugin;
