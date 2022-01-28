// Client
const CLIENT_ID_NOT_FOUND = (id: string) => 
  new Error(`Client with id (${id}) not found!`);
const CLIENT_EXISTS = () => 
  new Error('Client already exists!');
const FAILED_TO_CREATE_SCHEDULED_EVENT = () =>
  new Error('Failed to create scheduled event.');

// ScheduledEvent
const SCHEDULED_EVENT_EXISTS = () => 
  new Error('Scheduled event with matching data already exists.')
const SCHEDULED_EVENT_NOT_FOUND = () =>
  new Error('Scheduled event not found.');

export {
  CLIENT_ID_NOT_FOUND,
  CLIENT_EXISTS,
  FAILED_TO_CREATE_SCHEDULED_EVENT,
  SCHEDULED_EVENT_EXISTS,
  SCHEDULED_EVENT_NOT_FOUND,
}