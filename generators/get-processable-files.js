const fs = require('fs');
const path = require('path');
const util = require('util');
const isMarkdownFile = require('./utils/is-markdown-file');
const shouldCopyFile = require('./utils/should-copy-file');

const readdir = util.promisify(fs.readdir);

const getProcessableFiles = ({ sourcePath, destinationPath, copyableFiles = ['.html', '.ico']}) => new Promise((resolve, reject) => {
  readdir(sourcePath)
    .then(files => {
      const markdowns = files.filter(isMarkdownFile);
      const copyables = files.filter(file => shouldCopyFile(file, copyableFiles));

      resolve({
        markdownFiles: markdowns.map(file => ({
          source: path.join(sourcePath, file),
          destination: path.join(destinationPath, `${path.parse(file).name}.html`)
        })),
        copyableFiles: copyables.map(file => ({
          source: path.join(sourcePath, file),
          destination: path.join(destinationPath, file)
        })),
      });
    })
    .catch(err => reject(err));
});

module.exports = getProcessableFiles;
