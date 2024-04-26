import { model, Schema } from 'mongoose';

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

CounterSchema.methods['increment'] = async function () {
  this['seq'] += 1;
  return this['save']();
};

export default model('Counter', CounterSchema);
