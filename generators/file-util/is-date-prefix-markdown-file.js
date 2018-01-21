const DATE_PREFIX_REGEX = /^\d{4}-\d{2}-\d{2}-[\w-]+(.md)$/;

const isDatePrefixMarkdownFile = file => file.match(DATE_PREFIX_REGEX) !== null;

module.exports = isDatePrefixMarkdownFile;
