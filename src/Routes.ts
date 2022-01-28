import { Schema } from 'joi';
import { createScheduledEventSchema } from './models/ScheduledEvent.model';

export type Route = {
  path: string;
  authRequired?: boolean;
  method: string;
  bodyValidationSchema?: Schema;
}

export const routeConfigs: Route[] = [
  {
    path: '/events',
    method: 'GET',
    authRequired: true,
  },
  {
    path: '/events',
    method: 'POST',
    authRequired: true,
    bodyValidationSchema: createScheduledEventSchema,
  }
]