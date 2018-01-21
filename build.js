const config = require('./config');
const generate = require('./generators/generate');
const startWatcher = require('./generators/start-watcher');
const webpackRunner = require('./webpack-runner');

const ENABLE_WATCH = process.argv.filter(arg => arg === '--watch').length > 0;

const watch = () => {
  startWatcher(config);

  webpackRunner.watch({
    onSuccess: stats => {
      webpackRunner.printStats(stats);
      console.log('🎉 Done bundling assets...');
    },
    onError: err => webpackRunner.printError(err)
  });
};

webpackRunner
  .run()
  .then(stats => {
    webpackRunner.printStats(stats);
    console.log('🎉 Done bundling assets...');

    return generate(config);
  })
  .then(() => {
    console.log('🎉 Done generating static sites...');

    if (ENABLE_WATCH) {
      watch();
    }
  })
  .catch(err => webpackRunner.printError(err));
