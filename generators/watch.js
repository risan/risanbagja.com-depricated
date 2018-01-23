const path = require('path');
const chokidar = require('chokidar');
const generate = require('./generate');

const logChange = (type, filePath) => {
  switch (type) {
    case 'add':
      return console.log(`🆕 File ${filePath} is added`);
    case 'change':
      return console.log(`🔧 File ${filePath} is changed`);
    case 'unlink':
      return console.log(`🔥 File ${filePath} is removed`);
    default:
      return console.log(`[${type}]: ${filePath}`);
  }
};

const handleChange = ({ type, filePath, callback = () => {} }) => {
  logChange(type, filePath);
  callback({ type, filePath });
};

const watch = (config, { onReady = () => {}, onChange = () => {} } = {}) => {
  const watcher = chokidar.watch(config.sourcePath, {
    ignored: [
      /(^|[/\\])\../,
      path.join(config.sourcePath, config.assets.sourceDir)
    ],
    persistent: true
  });

  watcher
    .on('ready', () => {
      console.log('👀 Initial scan complete, watching for file changes...');
      onReady();

      watcher.on('add', filePath =>
        handleChange({ type: 'add', filePath, callback: onChange })
      );
    })
    .on('change', filePath =>
      handleChange({ type: 'change', filePath, callback: onChange })
    )
    .on('unlink', filePath =>
      handleChange({ type: 'unlink', filePath, callback: onChange })
    )
    .on('error', error => console.error(error));

  return watcher;
};

module.exports = watch;
