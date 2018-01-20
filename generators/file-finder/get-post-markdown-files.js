const fs = require('fs');
const { URL } = require('url');
const path = require('path');
const util = require('util');
const isPostMarkdownFile = require('./is-post-markdown-file');

const readdir = util.promisify(fs.readdir);

const parseFilename = file => {
  const { name } = path.parse(file);

  return {
    name: `${name.slice(11)}.html`,
    date: new Date(name.slice(0, 10))
  };
}

const getPostMarkdownFiles = ({ sourcePath, destinationPath, baseUrl }) => new Promise((resolve, reject) => {
  readdir(sourcePath)
    .then(files => {
      const markdowns = files.filter(isPostMarkdownFile);

      resolve(markdowns.map(file => {
        const { name, date } = parseFilename(file);

        return {
          source: path.join(sourcePath, file),
          destination: path.join(destinationPath, name),
          url: (new URL(`${baseUrl.pathname}/${name}`, baseUrl.origin)).toString(),
          date
        };
      }));
    })
    .catch(err => reject(err));
});

module.exports = getPostMarkdownFiles;
