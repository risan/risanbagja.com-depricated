const path = require('path');
const pug = require('pug');
const fs = require('fs-extra');
const minifyHtml = require('html-minifier').minify;
const parseMarkdown = require('./parse-markdown');

class MarkdownProcessor {
  constructor({ defaultLayout, layoutsPath, defaultMinify = false }) {
    this.defaultLayout = defaultLayout;
    this.layoutsPath = layoutsPath;
    this.defaultMinify = defaultMinify;
  }

  process({ source, destination, url = null, defaultLayout = this.defaultLayout, minify = this.defaultMinify, viewData = {} }) {
    return new Promise((resolve, reject) => {
      parseMarkdown(source)
        .then(({ attributes, content }) => {
          const { layout = defaultLayout } = attributes;

          const pugLayout = pug.compileFile(
            path.join(this.layoutsPath, `${layout}.pug`));

          let html = pugLayout({ ...attributes, content, url, ...viewData });

          if (minify) {
            html = minifyHtml(html, {
              collapseWhitespace: true
            });
          }

          fs.outputFile(destination, html)
            .then(() => resolve({ ...attributes, url }))
            .catch(err => reject(err))
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = MarkdownProcessor;
