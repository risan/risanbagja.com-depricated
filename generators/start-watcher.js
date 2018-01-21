const path = require('path');
const chokidar = require('chokidar');
const generate = require('./generate');

const logChange = (type, path) => {
  switch (type) {
    case 'add':
      return console.log(`🆕 File ${path} is added`);
    case 'change':
      return console.log(`🔧 File ${path} is changed`);
    case 'unlink':
      return console.log(`🔥 File ${path} is removed`);
  }
}

const handleChange = ({ type, path, config }) => {
  logChange(type, path);

  generate(config)
    .then(() => console.log('🎉 Done regenerating static sites...'))
    .catch(err => console.error(err));
}

const startWatcher = config => {
  const watcher = chokidar.watch(config.sourcePath, {
    ignored: [
      /(^|[\/\\])\../,
      path.join(config.sourcePath, config.assets.sourceDir)
    ],
    persistent: true
  });

  watcher
    .on('ready', () => {
      console.log('👀 Initial scan complete, watching for file changes...');
      watcher.on('add', path => handleChange({ type: 'add', path, config }));
    })
    .on('change', path => handleChange({ type: 'change', path, config }))
    .on('unlink', path => handleChange({ type: 'unlink', path, config }))
    .on('error', error => console.error(error));

  return watcher;
};

module.exports = startWatcher;
