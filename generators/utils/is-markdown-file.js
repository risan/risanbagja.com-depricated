const path = require('path');

const isMarkdownFile = file => path.extname(file) === '.md';

module.exports = isMarkdownFile;
