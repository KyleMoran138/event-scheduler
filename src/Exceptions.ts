// Client
const CLIENT_ID_NOT_FOUND = (id: string) => 
  new Error(`Client with id (${id}) not found!`);
const CLIENT_EXISTS = () => 
  new Error('Client already exists!');

// ScheduledEvent
const SCHEDULED_EVENT_EXISTS = () => 
  new Error('Scheduled event with matching data already exists.')

export {
  CLIENT_ID_NOT_FOUND,
  CLIENT_EXISTS,
  SCHEDULED_EVENT_EXISTS,
}