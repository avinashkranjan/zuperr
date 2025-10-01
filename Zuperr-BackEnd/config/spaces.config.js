const AWS = require('aws-sdk');

// Configure DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
  region: 'blr1', // This can be any region for DO Spaces
  s3ForcePathStyle: false,
  signatureVersion: 'v4'
});

const uploadS3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_UPLOAD,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY_UPLOAD,
    region: 'blr1', // This can be any region for DO Spaces
    s3ForcePathStyle: false,
    signatureVersion: 'v4'
});

module.exports = { s3, uploadS3 };