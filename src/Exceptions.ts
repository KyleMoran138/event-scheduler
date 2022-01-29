// Client
const CLIENT_ID_NOT_FOUND = (id: string) => 
  new Error(`Client with id (${id}) not found!`);
const CLIENT_EXISTS = () => 
  new Error('Client already exists!');
  
  // ScheduledEvent
const SCHEDULED_EVENT_EXISTS = () => 
  new Error('Scheduled event with matching data already exists.')
const SCHEDULED_EVENT_NOT_FOUND = () =>
  new Error('Scheduled event not found.');
const FAILED_TO_CREATE_SCHEDULED_EVENT = () =>
    new Error('Failed to create scheduled event.');
const FAILED_TO_UPDATE_SCHEDULED_EVENT = () =>
    new Error('Failed to update scheduled event.');

export {
  CLIENT_ID_NOT_FOUND,
  CLIENT_EXISTS,
  SCHEDULED_EVENT_EXISTS,
  SCHEDULED_EVENT_NOT_FOUND,
  FAILED_TO_CREATE_SCHEDULED_EVENT,
  FAILED_TO_UPDATE_SCHEDULED_EVENT,
}