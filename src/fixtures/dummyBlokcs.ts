import mongoose from 'mongoose';

export default [
  {
    _id: mongoose.Types.ObjectId('621ee328d1172c53545dee69'),
    type: 'P',
    paragraphs: [],
  },
  {
    _id: mongoose.Types.ObjectId('621ee328d1172c53545dee6a'),
    type: 'R',
    paragraphs: [],
  },
  {
    _id: mongoose.Types.ObjectId('621ee328d1172c53545dee6b'),
    type: 'E',
    paragraphs: [
      mongoose.Types.ObjectId('621ee12cd1172c53545dee60'),
      mongoose.Types.ObjectId('621ee12cd1172c53545dee61'),
      mongoose.Types.ObjectId('621ee12cd1172c53545dee62'),
    ],
  },
];
