export default interface IScheduledEvent {
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

export const ScheduledEvent = (scheduledEventData: IScheduledEvent): IScheduledEvent => ({
  ...scheduledEventData,
  requestData: {...scheduledEventData.requestData},
  reportRequestData: {...scheduledEventData.reportRequestData}
})