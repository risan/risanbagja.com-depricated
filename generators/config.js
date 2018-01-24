const fs = require('fs-extra');
const { URL } = require('url');
const path = require('path');
const generateUrl = require('./file-util/generate-url');
const MarkdownProcessor = require('./markdown/processor');

class Config {
  constructor(siteConfig) {
    this.siteConfig = siteConfig;

    this.data = Object.assign({}, siteConfig);
    this.data.url = new URL(siteConfig.url);
    this.data.layoutPath = this.getSourcePath(siteConfig.layoutsDir);

    // Posts
    this.data.posts.sourcePath = this.getSourcePath(siteConfig.posts.sourceDir);
    this.data.posts.destinationPath = this.getDestinationPath(
      siteConfig.posts.destinationDir
    );
    this.data.posts.baseUrl = generateUrl(
      siteConfig.posts.destinationDir,
      this.data.url
    );
    this.data.posts.indexSourcePath = this.getSourcePath(
      siteConfig.posts.sourceDir,
      'index.md'
    );

    // Assets
    this.data.assets.sourcePath = this.getSourcePath(
      siteConfig.assets.sourceDir
    );
    this.data.assets.destinationPath = this.getDestinationPath(
      siteConfig.assets.destinationDir
    );
    this.data.assets.manifestPath = this.getDestinationPath(
      siteConfig.assets.destinationDir,
      siteConfig.assets.manifest
    );

    // Allow easy access to the config data.
    Object.entries(this.data).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  getSiteConfig() {
    return this.siteConfig;
  }

  getData() {
    return this.data;
  }

  getSourcePath(...paths) {
    return path.join(this.siteConfig.sourcePath, ...paths);
  }

  getDestinationPath(...paths) {
    return path.join(this.siteConfig.destinationPath, ...paths);
  }

  getMarkdownProcessor() {
    if (!this.markdownProcessor) {
      this.markdownProcessor = this.createMarkdownProcessor();
    }

    return this.markdownProcessor;
  }

  createMarkdownProcessor() {
    return new MarkdownProcessor({
      defaultLayout: this.defaultLayout,
      layoutsPath: this.layoutPath,
      defaultMinify: this.minifyOutput
    });
  }

  getAssetsManifest() {
    return fs.readJsonSync(this.assets.manifestPath);
  }

  getPostsSourcePath() {
    return this.posts.sourcePath;
  }

  getPostsDestinationPath() {
    return this.posts.destinationPath;
  }

  getPostsDefaultLayout() {
    return this.posts.defaultLayout;
  }

  getPostsBaseUrl() {
    return this.posts.baseUrl;
  }

  getPostsIndexSourcePath() {
    return this.posts.indexSourcePath;
  }

  getPostsPerPage() {
    return this.posts.pagination.perPage;
  }

  getPostsPaginationPath() {
    return this.posts.pagination.path;
  }
}

module.exports = Config;
