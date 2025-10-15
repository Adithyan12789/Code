// UploadMultipleMiddleware.js
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3-v3");
const fs = require("fs");
const path = require("path");

const createS3Instance = (hostname, accessKeyId, secretAccessKey) => {
  return new S3Client({
    endpoint: hostname,
    region: "ap-southeast-1",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
};

const digitalOceanS3 = createS3Instance(
  settingJSON.doHostname,
  settingJSON.doAccessKey,
  settingJSON.doSecretKey
);

const awsS3 = createS3Instance(
  settingJSON.awsHostname,
  settingJSON.awsAccessKey,
  settingJSON.awsSecretKey
);

const localStoragePath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(localStoragePath)) {
  fs.mkdirSync(localStoragePath, { recursive: true });
}

const storageOptions = {
  local: multer.diskStorage({
    destination: (req, file, cb) => cb(null, localStoragePath),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),

  digitalocean: multerS3({
    s3: digitalOceanS3,
    bucket: settingJSON.doBucketName,
    key: (req, file, cb) => {
      const folder = req.body.folderStructure || "uploads";
      cb(null, `${folder}/${file.originalname}`);
    },
  }),

  aws: multerS3({
    s3: awsS3,
    bucket: settingJSON.awsBucketName,
    acl: "public-read",
    key: (req, file, cb) => {
      const folder = req.body.folderStructure || "";
      cb(null, `${folder}/${file.originalname}`);
    },
  }),
};

const getActiveStorage = async () => {
  const settings = settingJSON;
  if (settings.storage.local) return "local";
  if (settings.storage.awsS3) return "aws";
  if (settings.storage.digitalOcean) return "digitalocean";
  return "local";
};

const uploadMultipleMiddleware = async (req, res, next) => {
  try {
    const activeStorage = await getActiveStorage();
    multer({ storage: storageOptions[activeStorage] }).array("content", 10)(
      req,
      res,
      next
    );
  } catch (error) {
    next(error);
  }
};

module.exports = uploadMultipleMiddleware;
