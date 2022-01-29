// Client

// Reasons:
// 1) Client not found with matching id
const CLIENT_ID_NOT_FOUND = (id: string) => 
  new Error(`Client with id (${id}) not found!`);

// Reasons:
// 1) Client with matching name and email already exists
const CLIENT_EXISTS = () => 
  new Error('Client already exists!');


// ScheduledEvent

// Reasons:
// 1) Data validation failes
// 2) Client not found
// 3) Scheduled event already exists with same name
const SCHEDULED_EVENT_EXISTS = () => 
  new Error('Scheduled event with matching data already exists.')

// Reasons:
// 1) Scheduled event not found with matching id
const SCHEDULED_EVENT_NOT_FOUND = () =>
  new Error('Scheduled event not found.');

// Reasons:
// 1) Database error
const FAILED_TO_CREATE_SCHEDULED_EVENT = () =>
  new Error('Failed to create scheduled event.');

// Reasons:
// 1) Database error
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