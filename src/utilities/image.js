/* global appman: true */

const BINARY_FILE = {
  ALLOWED_FILE_TYPES: ['png', 'jpg', 'jpeg', 'tif', 'heic'], // Allow type: png, jpg, jpeg
  MAX_FILE_SIZE: 5000000, // Max size upload file: 5MB
  UPLOADED_FILE_KEY: 'file', // name of field upload,
  FOLDER_UPLOAD: 'default',
};
const s3 = require('../core/s3/s3.service');
const { folder } = require('../constants');
const ggCloud = require('../core/google-cloud/google-cloud.service');

const getFullPathFile = (filePath, storage = 1) => {
  if (filePath) {
    return `${process.env.S3_URL}${filePath}`;
  }
  return null;
};

const getFullPathFileGgStorage = (filePath, storage = 1) => {
  if (filePath) {
    return `${process.env.GG_CLOUD_URL}${filePath}`;
  }
  return null;
};

module.exports = {
  saveUploadImage: async (req, fileProperties) => {
    try {
      return await s3.uploadFile({
        req,
        fileProperties: {
          fileKey: fileProperties.UPLOADED_FILE_KEY
            ? fileProperties.UPLOADED_FILE_KEY
            : BINARY_FILE.UPLOADED_FILE_KEY,
          allowedFileTypes: fileProperties.ALLOWED_FILE_TYPES
            ? fileProperties.ALLOWED_FILE_TYPES
            : BINARY_FILE.ALLOWED_FILE_TYPES,
          maxFileSize: fileProperties.MAX_FILE_SIZE
            ? fileProperties.MAX_FILE_SIZE
            : BINARY_FILE.MAX_FILE_SIZE,
        },
        folder:
          folder[
            fileProperties.FOLDER_UPLOAD
              ? fileProperties.FOLDER_UPLOAD
              : BINARY_FILE.FOLDER_UPLOAD
          ].thumbnail,
      });
    } catch (err) {
      throw err;
    }
  },

  deleteImage: async (key) => {
    try {
      return await s3.deleteObject(key);
    } catch (err) {
      throw err;
    }
  },
  getFullPathFile,
  getFullPathFileGgStorage,

  saveUploadImageGgCloud: async (req, fileProperties) => {
    try {
      return await ggCloud.uploadFile({
        req,
        fileProperties: {
          fileKey: fileProperties.UPLOADED_FILE_KEY
            ? fileProperties.UPLOADED_FILE_KEY
            : BINARY_FILE.UPLOADED_FILE_KEY,
          allowedFileTypes: fileProperties.ALLOWED_FILE_TYPES
            ? fileProperties.ALLOWED_FILE_TYPES
            : BINARY_FILE.ALLOWED_FILE_TYPES,
          maxFileSize: fileProperties.MAX_FILE_SIZE
            ? fileProperties.MAX_FILE_SIZE
            : BINARY_FILE.MAX_FILE_SIZE,
        },
        folder:
          folder[
            fileProperties.FOLDER_UPLOAD
              ? fileProperties.FOLDER_UPLOAD
              : BINARY_FILE.FOLDER_UPLOAD
          ].thumbnail,
        isTemp: true,
      });
    } catch (err) {
      throw err;
    }
  },
  deleteImageGgCloud: async (key) => {
    try {
      return await ggCloud.deleteObject(key);
    } catch (err) {
      throw err;
    }
  },
};
