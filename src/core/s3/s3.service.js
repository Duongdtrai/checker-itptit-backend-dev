const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({
  signatureVersion: 'v4',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const bucketName = process.env.S3_BUCKET;

module.exports = {
  /**
   * upload file to S3
   * @param {Object} req express request
   * @param {Object} fileProperties properties of the file
   * @param {String} folder path of the file
   *
   * @returns {String}
   */
  uploadFile: ({ req, fileProperties, folder, isTemp = false }) => {
    console.log("fileProperties", fileProperties)
    console.log("folder", folder)

    return new Promise((resolve, reject) => {
      const file = multer({
        storage: multerS3({
          s3: s3,
          bucket: bucketName,
          contentType: multerS3.AUTO_CONTENT_TYPE,
          metadata: function (req, file, cb) {
            console.log("file", file)
            cb(null, {
              fieldName: file.fieldname,
            });
          },
          key: function (req, file, cb) {
            const mimetype = _.findIndex(
              fileProperties.allowedFileTypes,
              (item) => {
                return file.mimetype.indexOf(item) >= 0;
              }
            );

            const extname = _.findIndex(
              fileProperties.allowedFileTypes,
              (item) => {
                return path.extname(file.originalname).indexOf(item) >= 0;
              }
            );

            // Allow upload any file type
            const allowAny = _.isEmpty(fileProperties.allowedFileTypes);

            if (mimetype >= 0 || extname >= 0 || allowAny) {
              const randomKey =
                Math.random().toString(36).substring(2, 16) +
                Math.random().toString(36).substring(2, 16) +
                Math.random().toString(36).substring(2, 16) +
                `.${file.originalname.split('.')[1]}`;

              const fileName = isTemp
                ? file.originalname
                : randomKey + '-tm-' + file.originalname;
              cb(null, `${folder}/${fileName}`);
            } else {
              cb(new Error('Error fileType!'));
            }
          },
        }),
        limits: {
          fileSize: fileProperties.maxFileSize,
        },
      }).array(fileProperties.fileKey, 10);

      file(req, null, (err) => {
        console.log("req.files", req.files, err)
        if (!err && req.files) {
          req.file = req.files;
          let pathImg = '';
          if (req.files.length > 1) {
            pathImg = req.files.map((e) => e.key);
          } else if (req.files.length === 1 && req.files[0].key) {
            pathImg = req.files[0].key;
          } else {
            pathImg = '';
          }
          resolve(pathImg);
        } else {
          console.log("lỗi")
          reject(new Error(err)); // Throw an error
        }
      });
    });
  },

  /**
   * Put object to S3
   * @param {String} file Binary of the file
   * @param {String} fileName Name of the file
   * @param {String} contentType MimeType of the file
   * @param {String} folder Path of the file
   * @param {Object} options Additional options
   *
   * @returns {String}
   */
  putObject: ({
    file,
    fileName,
    contentType,
    path,
    extension,
    options = {},
  }) => {
    const key = `${path}/${fileName}.${extension}`;
    const params = {
      Bucket: bucket,
      Body: Buffer.from(file, 'binary').toString('base64'),
      Key: key,
      ContentType: contentType,
      ...options,
    };

    return new Promise((resolve, reject) => {
      s3.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log('s3 putObject: ', data);
          resolve(data);
        }
      });
    });
  },

  /**
	 * Delete file on S3
	 * @param {String} key Path of the file
	 *
	 * @returns {Object}
	 */
	deleteObject: (key) => {
		return new Promise((resolve, reject) => {
			const params = {
				Bucket: bucket,
				Key: key
			};

			s3.deleteObject(params, (err, data) => {
				if (err) {
					reject(err);
				} else {
					console.log('s3 deleteObject: ', data);
					resolve(data);
				}
			});
		});
	},
};
