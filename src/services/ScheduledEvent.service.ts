import IScheduledEvent, { ScheduledEvent } from '../models/ScheduledEvent.model';
import Service from './Service';

export default class ScheduledEventService extends Service<IScheduledEvent>{

  constructor(){
    super();
  }

  /**
   * Creates a new scheduledEvent using the repo.
   * If missing required param returns null.
   * Get's all scheduledEvents for the provided clientId that aren't deleted.
   * If there's an event with the same name throws exception.
   * If repo fails returns null.
 
   * @param data: new ScheduledEventData
   * @param currentClientId: id of client making request
   * @returns IScheduledEvent | null
   * @throws scheduledEvent exists error
   */
  public create = async ({...data}): Promise<IScheduledEvent | null> => {

    if(!data.currentClientId || !data.newEventData){
      return null;
    }

    const newScheduledEventData = ScheduledEvent(data.newEventData);
    const allUserScheduledEvents = (await this.repo.getAllRecords({}) || [])
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

  /**
   * Get's a single scheduledEvent using the repo.
   * If missing required param returns null.
   * Filters out scheduledEvents that dont include currentClientId.
   * Filters out scheduled\Events that are deleted.
   * Finds scheduledEvent via _id.
   * Returns found scheduledEvent or null if not found.

   * @param currentClientId: id of client making request
   * @param _id: id of scheduledEvent to get 
   * @returns IScheduledEvent | null
   */
  public get = async ({...data}): Promise<IScheduledEvent | null> => {

    if(!data.currentClientId || !data._id){
      return null;
    }

    const scheduledEventToReturn = (await this.repo.getAllRecords({}) || [])
    .filter(event => event.clientId === data.currentClientId)
    .filter(event => !event.deleted)
    .find(event => event._id === data._id);

    return scheduledEventToReturn || null;
  };

  /**
   * If missing required params returns null.
   * Calls this.get and returns null if result is null.
   * Calls repo.updateRecord method and returns result.

   * @param currentClientId: id of client making request
   * @param _id: id of scheduledEvent to update
   * @param updatedData: data to update record with
   * @returns IScheduledEvent | null
   */
  public update = async ({...data}): Promise<IScheduledEvent | null> => {

    if(!data.currentClientId || !data._id || !data.updatedData){
      return null;
    }

    const existingRecord = await this.get({_id: data._id, currentClientId: data.currentClientId});

    if(!existingRecord){
      return null;
    }

    return this.repo.updateRecord(data._id, data.updatedData);
  };
  
  /**
   * If missing required params returns false.
   * Calls this.get and returns false if result is null.
   * Calls repo.deleteRecord and returns result.

   * @param currentClientId: id of client making request
   * @param _id: id of scheduledEvent to delete
   * @returns bool
   */
  public delete = async ({...data}): Promise<boolean> => {

    if(!data.currentClientId || !data._id){
      return false;
    }

    const recordToDelete = await this.get({_id: data._id, currentClientId: data.currentClientId});

    if(!recordToDelete){
      return false;
    }

    return this.repo.deleteRecord(data._id);
  };
  
}