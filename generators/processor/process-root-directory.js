const { URL } = require('url');
const path = require('path');
const copyFile = require('./../file-util/copy-file');
const getProcessableFiles = require('./../file-util/get-processable-files');
const MarkdownProcessor = require('./../markdown/processor');

const processRootDirectory = config =>
  new Promise((resolve, reject) =>
    getProcessableFiles({ ...config, baseUrl: new URL(config.url) })
      .then(({ markdownFiles, copyableFiles }) => {
        const copyFiles = Promise.all(
          copyableFiles.map(({ source, destination }) =>
            copyFile(source, destination)
          )
        );

        const markdownProcessor = new MarkdownProcessor({
          defaultLayout: config.defaultLayout,
          layoutsPath: path.join(config.sourcePath, config.layoutsDir),
          defaultMinify: config.minifyOutput
        });

        const processMarkdownFiles = Promise.all(
          markdownFiles.map(({ source, destination, url }) =>
            markdownProcessor.process({
              source,
              destination,
              url,
              viewData: {
                config
              }
            })
          )
        );

        Promise.all([copyFiles, processMarkdownFiles])
          .then(results => {
            console.log('✅ Done processing root directory...');
            resolve(results);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err))
  );

module.exports = processRootDirectory;
