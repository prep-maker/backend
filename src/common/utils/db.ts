import { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export const validateUnique = (schema: Schema) => {
  schema.plugin(uniqueValidator);
};
