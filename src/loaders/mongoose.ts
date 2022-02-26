import mongoose from 'mongoose';
import config from '../config/index.js';

const connectDB = () => {
  mongoose.connect(config.db.host);
};

export default connectDB;
