const Config = require('./config');
const generate = require('./generate');
const watch = require('./watch');
const webpackCompiler = require('./webpack/compiler');

const ENABLE_WATCH = process.argv.filter(arg => arg === '--watch').length > 0;

const getArgument = (index = 0, defaultValue = null) =>
  process.argv.length >= index + 3 && process.argv[index + 2] !== '--watch'
    ? process.argv[index + 2]
    : defaultValue;

/* eslint-disable import/no-dynamic-require */
const siteConfig = require(`./../${getArgument(0, 'site.config.js')}`);
const webpackConfig = require(`./../${getArgument(0, 'webpack.config.js')}`);
/* eslint-enable import/no-dynamic-require */

const config = new Config(siteConfig);

const build = async () => {
  try {
    const stats = await webpackCompiler.run(webpackConfig);
    webpackCompiler.printStats(stats);
    console.log('🎉 Done bundling assets...');

    await generate(config);
    console.log('🎉 Done generating static sites...');
  } catch (err) {
    webpackCompiler.printError(err);
  }
};

const startWatcher = () => {
  watch(config, {
    onChange: async () => {
      try {
        await generate(config);
        console.log('🎉 Done generating static sites...');
      } catch (err) {
        console.error(err);
      }
    }
  });
};

const buildAndWatch = () => {
  let firstTimeBuild = true;

  webpackCompiler.watch(webpackConfig, {
    onSuccess: async stats => {
      webpackCompiler.printStats(stats);
      console.log('🎉 Done bundling assets...');

      if (firstTimeBuild) {
        firstTimeBuild = false;

        try {
          generate(config);
          console.log('🎉 Done generating static sites...');
          startWatcher();
        } catch (err) {
          console.error(err);
        }
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
