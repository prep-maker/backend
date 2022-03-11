import mongoose from 'mongoose';

export const EMAIL = 'test1@email.com';

export default [
  {
    _id: mongoose.Types.ObjectId('621cafb14ed8fbc8812e845c'),
    email: 'test1@email.com',
    name: 'test1',
    password: 'test1234',
    writings: [],
  },
  {
    _id: mongoose.Types.ObjectId('621dfdcec156df650b5f6e74'),
    email: 'test2@email.com',
    name: 'test2',
    password: 'test1234',
    writings: [],
  },
];
