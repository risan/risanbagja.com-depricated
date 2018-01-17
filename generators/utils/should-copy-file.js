const path = require('path');

const shouldCopyFile = (file, copyableFiles) =>
  copyableFiles.includes(path.extname(file)) ||
  copyableFiles.includes(path.basename(file));

module.exports = shouldCopyFile;
