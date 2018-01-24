const fs = require('fs');
const path = require('path');
const util = require('util');
const isMarkdownFile = require('./is-markdown-file');
const shouldCopyFile = require('./should-copy-file');
const generateUrl = require('./generate-url');

const readdir = util.promisify(fs.readdir);

const getProcessableFiles = ({
  sourcePath,
  destinationPath,
  copyableFiles = ['.html', '.ico'],
  baseUrl
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const files = await readdir(sourcePath);
      const markdowns = files.filter(isMarkdownFile);
      const copyables = files.filter(file =>
        shouldCopyFile(file, copyableFiles)
      );

      resolve({
        markdownFiles: markdowns.map(file => {
          const filename = `${path.parse(file).name}.html`;

          return {
            source: path.join(sourcePath, file),
            destination: path.join(destinationPath, filename),
            url: generateUrl(filename, baseUrl)
          };
        }),
        copyableFiles: copyables.map(file => ({
          source: path.join(sourcePath, file),
          destination: path.join(destinationPath, file)
        }))
      });
    } catch (err) {
      reject(err);
    }
  });

module.exports = getProcessableFiles;
