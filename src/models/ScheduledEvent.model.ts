import IModel from './Model';

export default interface IScheduledEvent extends IModel {
  _id: string;
  clientId: string;
  name: string;
  cron: string;
  requestUrl: string;
  reportUrl: string;
  active: boolean;
  deleted: boolean;
  runOnInit: boolean;
  requestData: IRequestData;
  reportRequestData: IRequestData;  
}

export interface IRequestData {
  data?: unknown;
  headers?: HeadersInit;
}

export const ScheduledEvent = (scheduledEventData: Partial<IScheduledEvent>): IScheduledEvent => ({
  _id: '',
  clientId: '',
  name: '',
  cron: '',
  requestUrl: '',
  reportUrl: '',
  active: true,
  deleted: false,
  runOnInit: false,
  ...scheduledEventData,
  requestData: {...scheduledEventData.requestData},
  reportRequestData: {...scheduledEventData.reportRequestData}
})