import { CLIENT_ID_NOT_FOUND, FAILED_TO_CREATE_SCHEDULED_EVENT, SCHEDULED_EVENT_EXISTS, SCHEDULED_EVENT_NOT_FOUND } from '../Exceptions';
import { ScheduledEvent, ScheduledEventSchema, ScheduledEventSchemaName } from '../models/ScheduledEvent.model';
import { ClientService } from './Client.service';
import { Service } from './Service';
import { ScheduledTask } from 'node-cron';
import * as cron from 'node-cron';

export default class ScheduledEventService extends Service<ScheduledEvent>{

  private clientService: ClientService;

  // Currently running cron jobs
  private cronJobs: Map<string, ScheduledTask> = new Map();

  constructor(clientService: ClientService){
    super(ScheduledEventSchemaName, ScheduledEventSchema);

    this.clientService = clientService;
    this.startAllEventsCrons();
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
    const client = await this.clientService.get(clientId);

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

    const event = await this.create({...scheduledEventData, clientId: client._id});

    if(!event){
      throw FAILED_TO_CREATE_SCHEDULED_EVENT();
    }

    //schedule event
    await this.startEventCron(event?._id.toString());

    return event;

  };

  public getAllScheduledEvents = async (clientId: string): Promise<ScheduledEvent[] | null> => {
    return await this.find({
      clientId,
      deleted: false,
    });
  }

  public getScheduledEventById = async (clientId: string, eventId: string): Promise<ScheduledEvent | null> => {
    const event = await this.get(eventId);
    if(!event){
      return null;
    }

    if(event.clientId.toString() !== clientId){
      throw SCHEDULED_EVENT_NOT_FOUND();
    }

    return event;
  }

  public deleteScheduledEvent = async (clientId: string, eventId: string): Promise<string | null> => {
    const event = await this.get(eventId);
    if(!event){
      return null;
    }

    if(event.clientId.toString() !== clientId){
      throw SCHEDULED_EVENT_NOT_FOUND();
    }

    await this.delete(eventId);
    return eventId;
  }

  public startEventCron = async (eventId: string): Promise<ScheduledTask | null> => {
    const event = await this.get(eventId);
    if(!event){
      return null;
    }

    if(this.cronJobs.has(eventId)){
      return this.cronJobs.get(eventId) || null;
    }

    if(event.active){
      const cronJob = cron.schedule(event.cron, () => {
        // log message with eventId and name
        console.log(`(${event._id.toString()})${event.name} event triggered`);
      });

      this.cronJobs.set(eventId, cronJob);
      return cronJob;
    }

    return null;
  }

  public stopEventCron = async (eventId: string): Promise<boolean> => {
    const event = await this.get(eventId);
    if(!event){
      return false;
    }

    if(!this.cronJobs.has(eventId)){
      return true;
    }

    const cronJob = this.cronJobs.get(eventId);
    if(cronJob){
      cronJob.stop();
    }

    this.cronJobs.delete(eventId);
    return true;
  }

  public startAllEventsCrons = async (): Promise<boolean> => {
    const events = await this.getAll();
    if(!events){
      return false;
    }

    for(const event of events){
      await this.startEventCron(event._id.toString());
    }

    return true;
  }
  
}