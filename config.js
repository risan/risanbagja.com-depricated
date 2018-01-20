const path = require('path');

module.exports = {
  sourcePath: path.resolve(__dirname, 'src'),
  destinationPath: path.resolve(__dirname, 'public'),
  layoutsDir: 'layouts',
  defaultLayout: 'default',
  copyableFiles: ['.ico', '.html', 'robot.txt'],

  url: 'http://localhost:8000',
  siteDescription: 'Risan Bagja Pradana is an experienced Javascript and PHP developer',

  posts: {
    sourceDir: 'posts',
    destinationDir: 'blog',
    defaultLayout: 'post',
    pagination: {
      perPage: 4,
      path: 'page:num.html'
    }
  }
};
