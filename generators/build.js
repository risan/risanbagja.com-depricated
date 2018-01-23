const generate = require('./generate');
const watch = require('./watch');
const webpackCompiler = require('./webpack/compiler');

const config = require('./../site.config');
const webpackConfig = require('./../webpack.config');

const ENABLE_WATCH = process.argv.filter(arg => arg === '--watch').length > 0;

const build = () => {
  webpackCompiler
    .run(webpackConfig)
    .then(stats => {
      webpackCompiler.printStats(stats);

      console.log('🎉 Done bundling assets...');

      return generate(config);
    })
    .then(() => console.log('🎉 Done generating static sites...'))
    .catch(err => webpackCompiler.printError(err));
};

const startWatcher = () => {
  watch(config, {
    onChange: () => {
      generate(config)
        .then(() => console.log('🎉 Done generating static sites...'))
        .catch(err => console.error(err));
    }
  });
};

const buildAndWatch = () => {
  let firstTimeBuild = true;

  webpackCompiler.watch(webpackConfig, {
    onSuccess: stats => {
      webpackCompiler.printStats(stats);
      console.log('🎉 Done bundling assets...');

      if (firstTimeBuild) {
        firstTimeBuild = false;

        generate(config)
          .then(() => {
            console.log('🎉 Done generating static sites...');
            startWatcher();
          })
          .catch(err => console.error(err));
      }
    },
    onError: err => webpackCompiler.printError(err)
  });
};

if (ENABLE_WATCH) {
  buildAndWatch();
} else {
  build();
}
