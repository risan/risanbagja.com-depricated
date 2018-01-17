const path = require('path');

module.exports = {
  sourcePath: path.resolve(__dirname, 'src'),
  destinationPath: path.resolve(__dirname, 'public'),
  layoutsDir: 'layouts',
  defaultLayout: 'default',
  siteDescription: 'Risan Bagja Pradana is an experienced Javascript and PHP developer',

  copyableFiles: ['.ico', '.html', 'robot.txt'],

  source: {
    path: path.resolve(__dirname, 'src'),
    layoutDir: 'layouts',
    postsDir: 'posts'
  },
  destination: {
    path: path.resolve(__dirname, 'public'),
    postsDir: 'blog'
  }
};
