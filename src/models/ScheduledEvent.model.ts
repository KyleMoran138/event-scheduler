import { Schema } from 'mongoose';
import { IModel } from '../models/Model';
import { ObjectId, SchemaObjectId } from '../repo/Repo';

interface ScheduledEvent extends IModel {
  clientId: ObjectId;
  name: string;
  cron: string;
  requestUrl: string;
  reportUrl: string;
  active: boolean;
  deleted: boolean;
  runOnInit: boolean;
  requestData: RequestData;
  reportRequestData: RequestData;  
}

interface RequestData {
  data?: unknown;
  headers?: HeadersInit;
}

const RequestDataSchema = new Schema<RequestData>({
  data: {
    type: Schema.Types.Mixed,
    required: false,
  },
  headers: {
    type: Schema.Types.Mixed,
    required: false,
  },
});

const ScheduledEventSchemaName = 'ScheduledEvent';
const ScheduledEventSchema = new Schema<ScheduledEvent>({
  clientId: {
    type: SchemaObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cron: {
    type: String,
    required: true,
  },
  requestUrl: {
    type: String,
    required: true,
  },
  reportUrl: {
    type: String,
    required: false,
    default: '',
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  runOnInit: {
    type: Boolean,
    required: true,
    default: false,
  },
  requestData: {
    type: RequestDataSchema,
    required: false,
    default: {},
  },
  reportRequestData: {
    type: RequestDataSchema,
    required: false,
    default: {},
  },
});

export {
  ScheduledEvent,
  RequestData,
  ScheduledEventSchemaName,
  ScheduledEventSchema,
};