import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const BUCKET_NAME = 'uploads';

const getBucket = () => new GridFSBucket(mongoose.connection.db!, { bucketName: BUCKET_NAME });

export const uploadToGridFS = (buffer: Buffer, filename: string, contentType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const bucket = getBucket();
    const stream = bucket.openUploadStream(filename, { contentType });
    stream.on('finish', () => resolve(stream.id.toString()));
    stream.on('error', reject);
    stream.end(buffer);
  });
};

export const getGridFSFileMeta = async (fileId: string) => {
  const bucket = getBucket();
  const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray();
  return files[0] ?? null;
};

export const openGridFSDownloadStream = (fileId: string) => {
  return getBucket().openDownloadStream(new ObjectId(fileId));
};
