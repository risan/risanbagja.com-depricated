const copyFile = require('./../file-util/copy-file');
const getProcessableFiles = require('./../file-util/get-processable-files');

const processRootDirectory = config =>
  new Promise((resolve, reject) =>
    getProcessableFiles({
      sourcePath: config.sourcePath,
      destinationPath: config.destinationPath,
      copyableFiles: config.copyableFiles,
      baseUrl: config.url
    })
      .then(({ markdownFiles, copyableFiles }) => {
        const copyFiles = Promise.all(
          copyableFiles.map(({ source, destination }) =>
            copyFile(source, destination)
          )
        );

        const manifest = config.getAssetsManifest();

        const processMarkdownFiles = Promise.all(
          markdownFiles.map(({ source, destination, url }) =>
            config.getMarkdownProcessor().process({
              source,
              destination,
              url,
              viewData: {
                config: config.getData(),
                manifest
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
