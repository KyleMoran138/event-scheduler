import { Schema } from 'mongoose';
import { IModel } from '../models/Model';

interface ResponseData<T = unknown> extends IModel {
  status: 'OK' | 'ERROR' | 'UNKNOWN';
  message: string;
  errorMessage: string;
  data: T;
}

const ResponseDataSchemaName = 'ResponseData';
const ResponseDataSchema = new Schema<ResponseData>({
  status: {
    type: String,
    required: true,
    default: 'UNKNOWN',
  },
  message: {
    type: String,
    required: false,
    default: '',
  },
  errorMessage: {
    type: String,
    required: false,
    default: '',
  },
  data: {
    type: Schema.Types.Mixed,
    required: false,
    default: null,
  },
});

export {
  ResponseData,
  ResponseDataSchemaName,
  ResponseDataSchema,
}