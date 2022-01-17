import { Schema } from 'mongoose';
import { IModel } from '../models/Model';

interface Client extends IModel {
  name: string;
  email: string;
  disabled: boolean;
  keys: {name: string, value: string}[];
}

const KeysSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const ClientSchemaName = 'Client';
const ClientSchema = new Schema<Client>({
  name: {
    type: String,
    required: true,
    default: '',
  },
  email: {
    type: String,
    required: true,
    default: '',
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  keys: {
    type: [KeysSchema],
    required: false,
    default: [],
  },
})

export {
  Client,
  ClientSchemaName,
  ClientSchema,
}
