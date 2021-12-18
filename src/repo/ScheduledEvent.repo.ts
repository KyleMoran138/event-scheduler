import Repo from './Repo';
import IScheduledEvent from '../models/ScheduledEvent.model';

export default class ScheduledEventRepo extends Repo<IScheduledEvent> {
  public createRecord = async (newData: Partial<IScheduledEvent>): Promise<IScheduledEvent | null> => {
    return null;
  };
  public getRecord = async (_id: string): Promise<IScheduledEvent | null> => {
    return null;
  };
  public getAllRecords = async (): Promise<IScheduledEvent[] | null> => {
    return null;
  };
  public updateRecord = async (_id: string, newData: Partial<IScheduledEvent>): Promise<IScheduledEvent | null> => {
    return null;
  };
  public deleteRecord = async (_id: string): Promise<boolean> => {
    return false;
  };
} 