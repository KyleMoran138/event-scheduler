import { CLIENT_ID_NOT_FOUND, SCHEDULED_EVENT_EXISTS } from '../Exceptions';
import { ScheduledEvent, ScheduledEventSchema, ScheduledEventSchemaName } from '../models/ScheduledEvent.model';
import { ClientService } from './Client.service';
import { Service } from './Service';

export default class ScheduledEventService extends Service<ScheduledEvent>{

  constructor(){
    super(ScheduledEventSchemaName, ScheduledEventSchema);
  }

  /**
   * Create new scheduledEvent
   * 
   * 1) Get client.
   * 2) If Client is not found throw CLIENT_ID_NOT_FOUND exception.
   * 3) Find events with matching clientId and name that are not deleted.
   * 4) If matching event found throw SCHEDULED_EVENT_EXISTS exception.
   * 5) return new scheduledEvent.
 
   * @param clientId: owner clientId
   * @param scheduledEventData: data to create
   * @throws CLIENT_ID_NOT_FOUND
   * @throws SCHEDULED_EVENT_EXISTS
   * @returns ScheduledEvent | null
   */
  public createScheduledEvent = async (clientId: string, scheduledEventData: Partial<ScheduledEvent>): Promise<ScheduledEvent | null> => {
    const clientService = new ClientService();
    const client = await clientService.get(clientId);

    if(!client){
      throw CLIENT_ID_NOT_FOUND(clientId);
    }

    const eventExists = (await this.find({
      clientId,
      name: scheduledEventData.name,
      deleted: false,
    }))?.length;

    if(eventExists){
      throw SCHEDULED_EVENT_EXISTS();
    }

    return await this.create(scheduledEventData);
  };
  
}