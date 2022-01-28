import { Schema } from 'joi';

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
  }
]