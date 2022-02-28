import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import config from '../config/index.js';
import { UserDocument, UserModel, UserSchema } from '../types/user.js';
import { useVirtualId, validateUnique } from '../utils/db.js';

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

useVirtualId<UserSchema>(userSchema);
validateUnique(userSchema);

userSchema.methods.setPassword = async function (password: string) {
  const hased = await bcrypt.hash(password, config.bcrypt.saltRound);
  this.password = hased;
};

userSchema.methods.isPasswordValid = async function (
  password: string
): Promise<boolean> {
  const result = await bcrypt.compare(password, this.password);

  return result;
};

userSchema.statics.findByEmail = async function (
  email: string
): Promise<UserDocument> {
  const user = await this.findOne({ email });

  return user;
};

const userModel = mongoose.model<UserDocument, UserModel>('User', userSchema);
export default userModel;
