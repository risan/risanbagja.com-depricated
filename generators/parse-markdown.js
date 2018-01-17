const fs = require('fs');
const util = require('util');
const fm = require('front-matter');
const MarkdownIt = require('markdown-it');

const readFile = util.promisify(fs.readFile);
const md = new MarkdownIt();

const parseMarkdown = filePath => new Promise((resolve, reject) => {
  readFile(filePath, { encoding: 'utf8' })
    .then(data => {
      const { attributes, body } = fm(data);

      resolve({ attributes, content: md.render(body) });
    })
    .catch(err => reject(err));
});

module.exports = parseMarkdown;
