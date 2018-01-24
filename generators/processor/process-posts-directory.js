const getPostMarkdownFiles = require('./../file-util/get-post-markdown-files');
const createPostsIndex = require('./create-posts-index');

const processPostsDirectory = config =>
  new Promise(async (resolve, reject) => {
    try {
      const files = await getPostMarkdownFiles({
        sourcePath: config.getPostsSourcePath(),
        destinationPath: config.getPostsDestinationPath(),
        baseUrl: config.getPostsBaseUrl()
      });

      const manifest = config.getAssetsManifest();

      const results = await Promise.all(
        files.map(({ source, destination, url }) =>
          config.getMarkdownProcessor().process({
            source,
            destination,
            url,
            defaultLayout: config.getPostsDefaultLayout(),
            viewData: {
              config: config.getData(),
              manifest
            }
          })
        )
      );

      await createPostsIndex(results, config)

      console.log('✅ Done processing posts directory...');
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });

module.exports = processPostsDirectory;
