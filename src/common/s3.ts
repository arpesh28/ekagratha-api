import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//  Environments
const bucket = process.env.S3_BUCKET! as string;
const region = process.env.S3_REGION! as string;
const accessKeyId = process.env.S3_ACCESS_KEY! as string;
const secretAccessKey = process.env.S3_CLIENT_SECRET! as string;

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const getS3ObjectUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);

  return url;
};

const uploadS3ObjectUrl = async (filename: string, contentType: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `uploads/${filename}`,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command);

  return url;
};

export { getS3ObjectUrl, uploadS3ObjectUrl };
