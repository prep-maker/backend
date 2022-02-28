import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export const validateUnique = (schema: mongoose.Schema) => {
  schema.plugin(uniqueValidator);
};
