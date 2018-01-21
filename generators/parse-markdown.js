const fs = require('fs');
const path = require('path');
const util = require('util');
const fm = require('front-matter');
const MarkdownIt = require('markdown-it');
const isDatePrefixMarkdownFile = require('./file-util/is-date-prefix-markdown-file');

const readFile = util.promisify(fs.readFile);
const md = new MarkdownIt();

const getDateFromFilePath = filePath => {
  const { base } = path.parse(filePath);

  return isDatePrefixMarkdownFile(base) ? new Date(base.slice(0, 10)) : null;
}

const getExcerptFromContent = content => {
  const matchedFirstParagraph = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);

  return null === matchedFirstParagraph ? null : matchedFirstParagraph[1];
}

const parseMarkdown = filePath => new Promise((resolve, reject) => {
  readFile(filePath, { encoding: 'utf8' })
    .then(data => {
      const { attributes, body } = fm(data);
      const content = md.render(body);

      if (attributes.date) {
        attributes.date = new Date(attributes.date);
      } else {
        attributes.date = getDateFromFilePath(filePath);
      }

      if (! attributes.excerpt) {
        attributes.excerpt = getExcerptFromContent(content);
      }

      resolve({ attributes, content });
    })
    .catch(err => reject(err));
});

module.exports = parseMarkdown;
