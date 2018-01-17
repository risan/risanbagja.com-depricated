const path = require('path');
const config = require('./config');
const copyFile = require('./generators/utils/copy-file');
const getProcessableFiles = require('./generators/get-processable-files');
const MarkdownProcessor = require('./generators/markdown-processor');

const markdownProcessor = new MarkdownProcessor({
  defaultLayout: config.defaultLayout,
  layoutsPath: path.join(config.sourcePath, config.layoutsDir)
});

getProcessableFiles({ ...config })
  .then(({ markdownFiles, copyableFiles }) => {
    Promise.all(copyableFiles.map(({ source, destination }) => copyFile(source, destination)))
      .then(() => console.log('✅ Done copying files...'))
      .catch(err => console.error(err));

    Promise.all(markdownFiles.map(({ source, destination }) => markdownProcessor.process(source, destination, { config })))
      .then(results => console.log(results))
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
