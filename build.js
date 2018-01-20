const path = require('path');
const chokidar = require('chokidar');
const config = require('./config');
const generate = require('./generators/generate');

const enableWatch = process.argv.filter(arg => arg === '--watch').length > 0;

generate(config)
  .then(() => {
    console.log('🎉 Done generating static sites...');

    if (enableWatch) {
      startWatcher();
    }
  })
  .catch(err => console.error(err));

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

const handleChange = (type, path) => {
  logChange(type, path);

  generate(config)
    .then(() => console.log('🎉 Done regenerating static sites...'))
    .catch(err => console.error(err));
}

const startWatcher = () => {
  const watcher = chokidar.watch(config.sourcePath, {
    ignored: [/(^|[\/\\])\../, path.join(config.sourcePath, 'assets')],
    persistent: true
  });

  watcher
    .on('ready', () => {
      console.log('👀 Initial scan complete, watching for file changes...');
      watcher.on('add', path => handleChange('add', path));
    })
    .on('change', path => handleChange('change', path))
    .on('unlink', path => handleChange('unlink', path))
    .on('error', error => console.error(error));

  return watcher;
};
