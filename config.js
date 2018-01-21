const path = require('path');

module.exports = {
  // Site config
  url: 'http://localhost:8000',
  siteDescription: 'Risan Bagja Pradana is an experienced Javascript and PHP developer',

  // Where things are
  sourcePath: path.resolve(__dirname, 'src'),
  destinationPath: path.resolve(__dirname, 'public'),
  layoutsDir: 'layouts',
  defaultLayout: 'default',
  copyableFiles: ['.ico', '.html', 'robot.txt'],

  // Posts settings
  posts: {
    sourceDir: 'posts',
    destinationDir: 'blog',
    defaultLayout: 'post',
    pagination: {
      perPage: 4,
      path: 'page:num.html'
    }
  },

  // Assets settings
  assets: {
    sourceDir: 'assets',
    destinationDir: 'assets',
    entries: {
      index: 'scss/index.scss',
      blog: 'scss/blog.scss'
    }
  }
};
