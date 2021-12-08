import IScheduledEvent from '../models/ScheduledEvent.model';
import Repo from '../repo/Repo';
import Service from './Service';

export default class ScheduledEventService extends Service<ScheduledEventService>{

  constructor(){
    super();
  }

  public create = async (data: unknown): Promise<ScheduledEventService | null> => {
    const allUserScheduledEvents = await this.repo.getAllRecords();



    return null;
  };
  public get = async (): Promise<ScheduledEventService | null> => {
    return null;
  };
  public update = async (): Promise<ScheduledEventService | null> => {
    return null;
  };
  public delete = async (): Promise<ScheduledEventService | null> => {
    return null;
  };
  
}