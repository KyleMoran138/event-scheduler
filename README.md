# Event Scheduler

__Desc__: A REST API that let's you schedule cron tasks that can make calls back webhooks for daemon/serverless tasks. 

__Goal__: I have some serverless functions that need to run on an interval or on a secheduled time. I would like this service to call out to my functions to trigger events, builds and updates. This should also support some basic request functionality such as header specs, body data and maybe logging (If I'm feeling like it). 

### Typings
- ScheduledEvent
  - _id: string
  - clientId: string
  - name: string
  - cron: string
  - requestUrl: string (maybe rename to webhook url, more descriptive)
  - reportUrl?: string
  - active: boolean 
  - deleted: boolean
  - runOnInit: boolean
  - requestData?:
    ```
    {
      data: string (JSON),
      headers: string (JSON HeaderInit),
    }
    ```
  - reportRequestData?:
    ```
    {
      data: string (JSON),
      headers: string (JSON HeaderInit),
    }
    ```
- ResponseData
  - status: 'OK' | 'ERROR' | 'UNKNOWN'
  - message: string
  - errorMessage: string
  - data: \<responseDataType>

- ScheduledEventReport:
  - ???

- Client:
  - _id: string
  - name: string
  - email: string
  - disabled: boolean
  - keys: {name: string, value: string}[]

### Endpoints
- post /scheduledEvent
  - Desc: creates scheduledEvent
- put /scheduledEvent/:_id
  - Desc: updates values for scheduledEvent
- delete /scheduledEvent/:_id
  - Desc: sets scheduledEvent deleted to true
- get /scheduledEvent
  - Desc: get all scheduleEvents for your service account
- get /scheduledEvent/:id
  - Desc: Get scheduledEvent by id
  - Response: scheduledEvent
- get /scheduledEventReport/:scheduledEventId
  - get latest report for scheduled event
- get /scheduledEventReports/:scheduledEventId
  - get all reports for scheduled event

### TODOs
- I should probably get some unit testing around this, I would like to be able to depend on this api some day so it'd be good to have those...