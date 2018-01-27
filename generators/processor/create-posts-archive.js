const createPostsArchive = (posts, config) =>
  config.getMarkdownProcessor().process({
    source: config.getPostsArchiveSourcePath(),
    destination: config.getPostsArchiveDestinationPath(),
    url: config.getPostsArchiveUrl(),
    viewData: {
      config: config.getData(),
      posts,
      manifest: config.getAssetsManifest()
    }
  });

module.exports = createPostsArchive;
