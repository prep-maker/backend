import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import config from '../common/config/index.js';
import { UserAccount, UserDocument, UserModel } from '../common/types/user.js';
import { validateUnique } from '../common/utils/db.js';

const userSchema: Schema<UserDocument> = new mongoose.Schema({
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
  writings: {
    type: [mongoose.Types.ObjectId],
    default: [],
    ref: 'Writing',
  },
});

validateUnique(userSchema);

userSchema.methods.setPassword = async function (password: string) {
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRound);
  this.password = hashed;
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

userSchema.statics.createNewUser = async function (
  user: UserAccount
): Promise<UserDocument> {
  const newUser: UserDocument = new this(user);
  await newUser.setPassword(user.password);
  await newUser.save();

  return newUser;
};

userSchema.statics.addWriting = async function (
  userId: string,
  writingId: string
) {
  await this.findByIdAndUpdate(userId, { writings: writingId });
};

userSchema.statics.deleteWriting = async function (
  userId: string,
  writingId: string
) {
  await this.findByIdAndUpdate(userId, { $pull: { writings: writingId } });
};

const userModel = mongoose.model<UserDocument, UserModel>('User', userSchema);
export default userModel;
