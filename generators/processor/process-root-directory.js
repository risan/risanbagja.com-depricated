const copyFile = require('./../file-util/copy-file');
const getProcessableFiles = require('./../file-util/get-processable-files');

const processRootDirectory = config =>
  new Promise(async (resolve, reject) => {
    try {
      const { markdownFiles, copyableFiles } = await getProcessableFiles({
        sourcePath: config.sourcePath,
        destinationPath: config.destinationPath,
        copyableFiles: config.copyableFiles,
        baseUrl: config.url
      });

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

      const results = await Promise.all([copyFiles, processMarkdownFiles]);
      console.log('✅ Done processing root directory...');
      resolve(results);
    } catch (err) {
      reject(err);
    }
  });

module.exports = processRootDirectory;
