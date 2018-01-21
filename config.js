const path = require('path');
const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

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

  // Markdown settings
  minifyOutput: IS_PRODUCTION,

  // Assets settings
  assets: {
    sourceDir: 'assets',
    destinationDir: 'assets',
    entries: {
      blog: 'scss/blog.scss'
    }
  }
};
