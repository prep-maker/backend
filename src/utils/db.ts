import mongoose, { HydratedDocument } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export const useVirtualId = <T>(schema: mongoose.Schema) => {
  schema.virtual('id').get(function (this: HydratedDocument<T>) {
    return this._id.toString();
  });
  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
};

export const validateUnique = (schema: mongoose.Schema) => {
  schema.plugin(uniqueValidator);
};
