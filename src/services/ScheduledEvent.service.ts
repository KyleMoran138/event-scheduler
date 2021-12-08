import IScheduledEvent, { ScheduledEvent } from '../models/ScheduledEvent.model';
import Repo from '../repo/Repo';
import Service from './Service';

export default class ScheduledEventService extends Service<IScheduledEvent>{

  constructor(){
    super();
  }

  public create = async ({...data}): Promise<IScheduledEvent | null> => {
    const newScheduledEventData = ScheduledEvent(data.newEventData);
    const allUserScheduledEvents = (await this.repo.getAllRecords() || [])
    .filter(event => event.clientId === data.currentClientId)
    .filter(event => !event.deleted);

    const eventExists = allUserScheduledEvents.find(event => 
      event.name === newScheduledEventData.name 
    );

    if(eventExists){
      throw new Error(`ScheduledEvent exists with id of (${eventExists._id})`);
    }

    return await this.repo.createRecord(newScheduledEventData);
  };

  public get = async ({...data}): Promise<IScheduledEvent | null> => {
    const allUserScheduledEvents = (await this.repo.getAllRecords() || [])
    .filter(event => event.clientId === data.currentClientId)
    .filter(event => !event.deleted);

    return (await allUserScheduledEvents.find(data._id)) || null;
  };

  public update = async (): Promise<IScheduledEvent | null> => {
    return null;
  };
  
  public delete = async (): Promise<IScheduledEvent | null> => {
    return null;
  };
  
}