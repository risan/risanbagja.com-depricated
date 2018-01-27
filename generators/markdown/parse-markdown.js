const fs = require('fs');
const path = require('path');
const util = require('util');
const fm = require('front-matter');
const hljs = require('highlight.js');
const MarkdownIt = require('markdown-it');
const markdownItNamedHeadings = require('markdown-it-named-headings');
const markdownItLazysizes = require('./markdown-it-lazysizes');
const isDatePrefixMarkdownFile = require('./../file-util/is-date-prefix-markdown-file');

const readFile = util.promisify(fs.readFile);

const md = new MarkdownIt({
  highlight: (str, lang) => {
    const { value, language } = (lang  && hljs.getLanguage(lang)) ?
      hljs.highlight(lang, str) : hljs.highlightAuto(str);

    return `<pre><code class="hljs ${language}">${value}</code></pre>`;
  }
});

md.use(markdownItNamedHeadings);
md.use(markdownItLazysizes);

const getDateFromFilePath = filePath => {
  const { base } = path.parse(filePath);

  return isDatePrefixMarkdownFile(base) ? new Date(base.slice(0, 10)) : null;
};

const getExcerptFromContent = content => {
  const matchedFirstParagraph = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);

  return matchedFirstParagraph === null ? null : matchedFirstParagraph[1];
};

const parseMarkdown = filePath =>
  new Promise(async (resolve, reject) => {
    try {
      const data = await readFile(filePath, { encoding: 'utf8' });
      const { attributes, body } = fm(data);
      const content = md.render(body);

      if (typeof attributes.tags === 'string') {
        attributes.tags = [attributes.tags];
      }

      if (attributes.date) {
        attributes.date = new Date(attributes.date);
      } else {
        attributes.date = getDateFromFilePath(filePath);
      }

      if (!attributes.excerpt) {
        attributes.excerpt = getExcerptFromContent(content);
      }

      resolve({ attributes, content });
    } catch (err) {
      reject(err);
    }
  });

module.exports = parseMarkdown;
