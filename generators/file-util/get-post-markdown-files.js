const fs = require('fs');
const { URL } = require('url');
const path = require('path');
const util = require('util');
const isDatePrefixMarkdownFile = require('./is-date-prefix-markdown-file');

const readdir = util.promisify(fs.readdir);

const getOutputFilename = file => {
  const { name } = path.parse(file);

  return `${name.slice(11)}.html`;
}

const getPostMarkdownFiles = ({ sourcePath, destinationPath, baseUrl }) => new Promise((resolve, reject) => {
  readdir(sourcePath)
    .then(files => {
      const markdowns = files.filter(isDatePrefixMarkdownFile);

      resolve(markdowns.map(file => {
        const filename = getOutputFilename(file);

        return {
          source: path.join(sourcePath, file),
          destination: path.join(destinationPath, filename),
          url: (new URL(`${baseUrl.pathname}/${filename}`, baseUrl.origin)).toString(),
        };
      }));
    })
    .catch(err => reject(err));
});

module.exports = getPostMarkdownFiles;
