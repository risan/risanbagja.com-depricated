const path = require('path');
const pug = require('pug');
const fs = require('fs-extra');
const parseMarkdown = require('./parse-markdown');

class MarkdownProcessor {
  constructor({ defaultLayout, layoutsPath }) {
    this.defaultLayout = defaultLayout;
    this.layoutsPath = layoutsPath;
  }

  process({ source, destination, url = null, defaultLayout = this.defaultLayout, viewData = {} }) {
    return new Promise((resolve, reject) => {
      parseMarkdown(source)
        .then(({ attributes, content }) => {
          const { layout = defaultLayout } = attributes;

          const pugLayout = pug.compileFile(path.join(this.layoutsPath, `${layout}.pug`), {
            pretty: true
          });

          const html = pugLayout({ ...attributes, content, url, ...viewData });

          fs.outputFile(destination, html)
            .then(() => resolve({ ...attributes, url }))
            .catch(err => reject(err))
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = MarkdownProcessor;
