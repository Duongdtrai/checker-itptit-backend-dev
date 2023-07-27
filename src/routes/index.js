const express = require('express');
const path = require('path');
const fs = require('fs');

const readAllFilesInDir = (dir) => {
  return fs.statSync(dir).isDirectory()
    ? Array.prototype.concat(
        ...fs.readdirSync(dir).map((f) => readAllFilesInDir(path.join(dir, f)))
      )
    : dir;
};

const routerFile = (rootRouterPath) => {
  const router = express.Router();
  const fileArr = readAllFilesInDir(rootRouterPath);
  fileArr.forEach((filePath) => {
    if (filePath.indexOf('.router.js') >= 0) {
      const baseFileName = path.basename(filePath);
      const apiUri = filePath
        .replace(rootRouterPath, '')
        .replace(baseFileName, '')
        .replace(/\\/gi, '/');
      router.use(apiUri, require(filePath));
      router.use(require(filePath));
    }
  });
  return router;
};

module.exports = {
  routerFile,
};
