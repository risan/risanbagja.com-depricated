const path = require('path');

const DATE_PREFIX_REGEX = /^\d{4}-\d{2}-\d{2}-[\w-]+(.md)$/;

const isDatePrefixMarkdownFile = file => null !== file.match(DATE_PREFIX_REGEX);

module.exports = isDatePrefixMarkdownFile;
