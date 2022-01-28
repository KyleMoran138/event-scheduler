import { Route, routeConfigs } from './Routes';
import { Request } from 'express';

const generateResponseBody = (message: string, data?: any) => {
  return JSON.stringify({
    message,
    data
  });
}

const generateErrorResponseBody = (message: string, error: any) => {
  return JSON.stringify({
    errorMessage: message,
    error,
  });
}

const getRouteConfigForRequest = (req: Request): Route | null => {
  const universalMethodRouteConfig = routeConfigs.find(route => 
    route.path === req.path && 
    route.method === '*'
  );

  const routeConfig = routeConfigs.find(route => 
    route.path === req.path && 
    route.method === req.method
  );

  return routeConfig || universalMethodRouteConfig || null;
}

export {
  generateResponseBody,
  generateErrorResponseBody,
  getRouteConfigForRequest,
}