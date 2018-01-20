const path = require('path');
const pug = require('pug');
const fs = require('fs-extra');
const parseMarkdown = require('./parse-markdown');

class MarkdownProcessor {
  constructor({ defaultLayout, layoutsPath }) {
    this.defaultLayout = defaultLayout;
    this.layoutsPath = layoutsPath;
  }

  static getExcerpt(content) {
    const matchedFirstParagraph = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);

    return null === matchedFirstParagraph ? null : matchedFirstParagraph[1];
  }

  process(source, destination, { defaultLayout = this.defaultLayout, url = null, date = null, ...viewData } = {}) {
    return new Promise((resolve, reject) => {
      parseMarkdown(source)
        .then(({ attributes, content }) => {
          const { layout = defaultLayout } = attributes;

          const pugLayout = pug.compileFile(path.join(this.layoutsPath, `${layout}.pug`), {
            pretty: true
          });

          if (attributes.date) {
            date = new Date(attributes.date);
          }

          if (!attributes) {
            const excerpt = match(/<p[^>]*>(.+)<\/p>/);
          }

          const excerpt = attributes.excerpt ? attributes.excerpt :
            MarkdownProcessor.getExcerpt(content);

          const html = pugLayout({ ...attributes, excerpt, url, date, content, ...viewData });

          fs.outputFile(destination, html)
            .then(() => resolve({ ...attributes, excerpt, destination, url, date }))
            .catch(err => reject(err))
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = MarkdownProcessor;
