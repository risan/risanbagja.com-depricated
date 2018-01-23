const generate = require('./generate');
const watch = require('./watch');
const webpackCompiler = require('./webpack/compiler');

const ENABLE_WATCH = process.argv.filter(arg => arg === '--watch').length > 0;

const getArgument = (index = 0, defaultValue = null) =>
  process.argv.length >= index + 3 && process.argv[index + 2] !== '--watch'
    ? process.argv[index + 2]
    : defaultValue;

/* eslint-disable import/no-dynamic-require */
const config = require(`./../${getArgument(0, 'site.config.js')}`);
const webpackConfig = require(`./../${getArgument(0, 'webpack.config.js')}`);
/* eslint-enable import/no-dynamic-require */

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
