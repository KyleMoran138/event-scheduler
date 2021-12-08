import IScheduledEvent from '../models/ScheduledEvent.model';

export default class ScheduledEventService {
  public static scheduleEvent = async (scheduledEventData: Partial<IScheduledEvent>): Promise<IScheduledEvent> => {
    
    return {
      _id: '',
      ownerId: '',
      name: '',
      cron: '',
      requestUrl: '',
      reportUrl: '',
      active: true,
      deleted: false,
      runOnInit: false,
      requestData: {

      },
      reportRequestData: {

      } ,
      ...scheduledEventData,
    }
  }
}