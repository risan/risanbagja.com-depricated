const fs = require('fs');
const path = require('path');
const util = require('util');
const isDatePrefixMarkdownFile = require('./is-date-prefix-markdown-file');
const generateUrl = require('./generate-url');

const readdir = util.promisify(fs.readdir);

const getOutputFilename = file => {
  const { name } = path.parse(file);

  return `${name.slice(11)}.html`;
};

const getPostMarkdownFiles = ({ sourcePath, destinationPath, baseUrl }) =>
  new Promise(async (resolve, reject) => {
    try {
      const files = await readdir(sourcePath);
      const markdowns = files.filter(isDatePrefixMarkdownFile);

      resolve(markdowns.map(file => {
          const filename = getOutputFilename(file);

          return {
            source: path.join(sourcePath, file),
            destination: path.join(destinationPath, filename),
            url: generateUrl(filename, baseUrl)
          };
        }));
    } catch (err) {
      reject(err);
    }
  });

module.exports = getPostMarkdownFiles;
