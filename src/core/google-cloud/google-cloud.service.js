const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');

const keyFilePath = path.join(__dirname, '../../../gg-cloud-key.json');

const storage = new Storage({
  projectId: process.env.GG_CLOUD_ID,
  keyFilename: keyFilePath,
});

module.exports = {
  uploadFile: ({ req, fileProperties, folder, isTemp = false }) => {
    return new Promise((resolve, reject) => {
      const file = multer({
        storage: multer.memoryStorage(),
        limits: {
          fileSize: fileProperties.maxFileSize,
        },
      }).array(fileProperties.fileKey, 10);

      file(req, null, async (err) => {
        if (!err && req.files) {
          const bucketName = process.env.GG_CLOUD_BUCKET;
          try {
            let pathImg = '';
            const bucket = storage.bucket(bucketName);
            function generateRandomFileName(file) {
              return (
                Math.random().toString(36).substring(2, 16) +
                Math.random().toString(36).substring(2, 16) +
                Math.random().toString(36).substring(2, 16) +
                `.${file.originalname.split('.')[1]}`
              );
            }

            if (req.files.length > 1) {
              pathImg = [];
              for (const file of req.files) {
                const randomKey = generateRandomFileName(file);
                const fileName = isTemp
                  ? file.originalname
                  : randomKey + '-tm-' + file.originalname;

                const gcsFileName = `${folder}/${fileName}`;
                const fileOptions = {
                  metadata: {
                    contentType: file.mimetype,
                  },
                };

                await bucket.file(gcsFileName).save(file.buffer, fileOptions);
                pathImg.push(gcsFileName);
              }
            } else if (req.files.length === 1 && req.files[0].buffer) {
              const file = req.files[0];
              const randomKey = generateRandomFileName(file);
              const fileName = isTemp
                ? file.originalname
                : randomKey + '-tm-' + file.originalname;

              const gcsFileName = `${folder}/${fileName}`;
              const fileOptions = {
                metadata: {
                  contentType: file.mimetype,
                },
              };

              await bucket.file(gcsFileName).save(file.buffer, fileOptions);
              pathImg = gcsFileName;
            }

            resolve(pathImg);
          } catch (err) {
            reject(new Error(err));
          }
        } else {
          reject(new Error(err));
        }
      });
    });
  },

  deleteObject: (key) => {
    return new Promise((resolve, reject) => {
      const bucketName = process.env.GG_CLOUD_BUCKET;

      try {
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(key);

        file.delete((err, data) => {
          if (err) {
            reject(err);
          } else {
            console.log('File deleted successfully:', key);
            resolve(data);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },
};
