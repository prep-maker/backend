import bcrypt from 'bcrypt';
import mongoose, { Document, Model } from 'mongoose';
import config from '../config/index.js';
import { useVirtualId, validateUnique } from '../utils/db.js';

export type User = {
  email: string;
  name: string;
  password: string;
};

export interface UserDocument extends User, Document {
  setPassword: (password: string) => Promise<void>;
  isPasswordValid: (password: string) => Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  findByEmail: (email: string) => Promise<UserDocument>;
}

const userSchema: mongoose.Schema<UserDocument> = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

useVirtualId<User>(userSchema);
validateUnique(userSchema);

userSchema.methods.setPassword = async function (password: string) {
  const hased = await bcrypt.hash(password, config.bcrypt.saltRound);
  this.password = hased;
};

userSchema.methods.isPasswordValid = async function (password: string) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

const userModel = mongoose.model<UserDocument, UserModel>('User', userSchema);
export default userModel;
