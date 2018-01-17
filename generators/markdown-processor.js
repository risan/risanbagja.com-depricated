const fs = require('fs');
const path = require('path');
const util = require('util');
const pug = require('pug');
const parseMarkdown = require('./parse-markdown');

const writeFile = util.promisify(fs.writeFile);

class MarkdownProcessor {
  constructor({ defaultLayout, layoutsPath }) {
    this.defaultLayout = defaultLayout;
    this.layoutsPath = layoutsPath;
  }

  process(source, destination, { defaultLayout = this.defaultLayout, ...viewData } = {}) {
    return new Promise((resolve, reject) => {
      parseMarkdown(source)
        .then(({ attributes, content }) => {
          const { layout = defaultLayout } = attributes;

          const pugLayout = pug.compileFile(path.join(this.layoutsPath, `${layout}.pug`), {
            pretty: true
          });

          const html = pugLayout({ ...attributes, content, ...viewData });

          writeFile(destination, html)
            .then(() => resolve({ attributes, destination }))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = MarkdownProcessor;
