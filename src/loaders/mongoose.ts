import mongoose from 'mongoose';
import config from '../common/config/index.js';

const connectDB = () => {
  mongoose.connect(config.db.host, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

export const disconnectDB = () => {
  mongoose.disconnect();
};

export const clearDB = async () => {
  await mongoose.connection.db.dropDatabase();
};

export default connectDB;
