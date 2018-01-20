const path = require('path');

const POST_FILENAME_REGEX = /^\d{4}-\d{2}-\d{2}-[\w-]+(.md)$/;

const isPostMarkdownFile = file => null !== file.match(POST_FILENAME_REGEX);

module.exports = isPostMarkdownFile;
