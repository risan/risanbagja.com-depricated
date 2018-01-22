const fs = require('fs');

const copyFile = (source, destination) =>
  new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);

    readStream.pipe(writeStream);

    readStream.on('error', err => reject(err));
    writeStream.on('error', err => reject(err));
    writeStream.on('close', resolve(true));
  });

module.exports = copyFile;
