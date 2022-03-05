import mongoose from 'mongoose';
import config from '../common/config/index.js';

const connectDB = () => {
  mongoose.connect(config.db.host, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

export default connectDB;
