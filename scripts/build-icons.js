const fs = require('fs-extra');
const jimp = require('jimp');
const path = require('./helper/path');
const log = require('./helper/logger');

const sourceFile = path.app('icon.png');
const iconFolder = path.cache('icons');

const clearIconFolder = (callback) => {
  fs.emptyDir(iconFolder, () => {
    log.success('Icon folder cleaned-up.');
    callback();
  });
};

const createIcon = (name, size, callback) => {
  const destFile = path.resolve(iconFolder, name);
  jimp.read(sourceFile, (readError, iconFile) => {
    iconFile.resize(size, size, (resizeError, resizedFile) => {
      resizedFile.write(destFile, () => {
        log.success(`Icon ${name} created.`);
        callback();
      });
    });
  });
};

clearIconFolder(() => {
  createIcon('icon-512px.png', 512, () => {
    createIcon('icon-192px.png', 192, () => {
      log.success('Icons updated.');
    });
  });
});
