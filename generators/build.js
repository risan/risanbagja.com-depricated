const config = require('./../site.config');
const generate = require('./generate');
const startWatcher = require('./start-watcher');
const webpackRunner = require('./webpack-runner');

const ENABLE_WATCH = process.argv.filter(arg => arg === '--watch').length > 0;

if (ENABLE_WATCH) {
  let firstTimeBuild = true;

  webpackRunner.watch({
    onSuccess: stats => {
      webpackRunner.printStats(stats);
      console.log('🎉 Done bundling assets...');

      if (firstTimeBuild) {
        firstTimeBuild = false;

        generate(config)
          .then(() => {
            console.log('🎉 Done generating static sites...');
            startWatcher(config);
          })
          .catch(err => console.error(err));
      }
    },
    onError: err => webpackRunner.printError(err)
  });
} else {
  webpackRunner
    .run()
    .then(stats => {
      webpackRunner.printStats(stats);

      console.log('🎉 Done bundling assets...');

      return generate(config);
    })
    .then(() => console.log('🎉 Done generating static sites...'))
    .catch(err => webpackRunner.printError(err));
}
