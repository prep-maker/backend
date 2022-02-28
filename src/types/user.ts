import mongoose, { Document, Model } from 'mongoose';

export type UserResponse = {
  userId: string;
  email: string;
  name: string;
  token: string;
};

export type UserSchema = {
  email: string;
  name: string;
  password: string;
  writings: mongoose.Types.ObjectId[];
};

export type UserAccount = Omit<UserSchema, 'writings'>;

export interface UserDocument extends UserSchema, Document {
  setPassword: (password: string) => Promise<void>;
  isPasswordValid: (password: string) => Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  findByEmail: (email: string) => Promise<UserDocument>;
}
