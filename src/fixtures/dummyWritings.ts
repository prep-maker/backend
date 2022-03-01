import mongoose from 'mongoose';

export default [
  {
    _id: mongoose.Types.ObjectId('621cb0b250e465dfac337175'),
    isDone: false,
    title: 'test1',
    author: mongoose.Types.ObjectId('621cafb14ed8fbc8812e845c'),
    blocks: [],
  },
  {
    _id: mongoose.Types.ObjectId('621cb0b250e465dfac337176'),
    isDone: true,
    title: 'test2',
    author: mongoose.Types.ObjectId('621cafb14ed8fbc8812e845c'),
    blocks: [],
  },
  {
    _id: mongoose.Types.ObjectId('621cb0b250e465dfac337177'),
    isDone: false,
    title: 'test3',
    author: mongoose.Types.ObjectId('621cafb14ed8fbc8812e845c'),
    blocks: [],
  },
  {
    _id: mongoose.Types.ObjectId('621cb0b250e465dfac337178'),
    isDone: true,
    title: 'test4',
    author: mongoose.Types.ObjectId('621cafb14ed8fbc8812e845c'),
    blocks: [],
  },
];
