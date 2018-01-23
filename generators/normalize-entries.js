const path = require('path');

const normalizeEntries = (entries, config) =>
  Object.entries(entries).reduce((normalized, entry) => {
    const prop = {};
    prop[entry[0]] = path.join(
      config.sourcePath,
      config.assets.sourceDir,
      entry[1]
    );

    return Object.assign({}, normalized, prop);
  }, {});

module.exports = normalizeEntries;
