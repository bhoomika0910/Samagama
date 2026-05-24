import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import os from 'os';
import path from 'path';
import fs from 'fs';

let memoryServer;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      return;
    } catch (error) {
      console.warn('Falling back to an in-memory MongoDB because the configured URI could not be reached.');
    }
  }

  try {
    const tempRoot = path.join(os.tmpdir(), 'samagama-mongodb');
    const dataDir = path.join(tempRoot, 'data');
    const binDir = path.join(tempRoot, 'bin');
    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(binDir, { recursive: true });

    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'samagama',
        dbPath: dataDir
      },
      binary: {
        downloadDir: binDir
      }
    });
    await mongoose.connect(memoryServer.getUri(), { dbName: 'samagama' });
  } catch (error) {
    console.error('Unable to start local or in-memory MongoDB. Set MONGO_URI to a running Mongo instance.', error);
    throw error;
  }
};