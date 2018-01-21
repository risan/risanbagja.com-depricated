const fs = require('fs');
const { URL } = require('url');
const path = require('path');
const util = require('util');
const isMarkdownFile = require('./is-markdown-file');
const shouldCopyFile = require('./should-copy-file');

const readdir = util.promisify(fs.readdir);

const getProcessableFiles = ({
  sourcePath, destinationPath, copyableFiles = ['.html', '.ico'], baseUrl,
}) => new Promise((resolve, reject) => {
  readdir(sourcePath)
    .then((files) => {
      const markdowns = files.filter(isMarkdownFile);
      const copyables = files.filter(file => shouldCopyFile(file, copyableFiles));

      resolve({
        markdownFiles: markdowns.map((file) => {
          const filename = `${path.parse(file).name}.html`;

          return {
            source: path.join(sourcePath, file),
            destination: path.join(destinationPath, filename),
            url: (new URL(`${baseUrl.pathname}/${filename}`, baseUrl.origin)).toString(),
          };
        }),
        copyableFiles: copyables.map(file => ({
          source: path.join(sourcePath, file),
          destination: path.join(destinationPath, file),
        })),
      });
    })
    .catch(err => reject(err));
});

module.exports = getProcessableFiles;
