import { Route, routeConfigs } from './Routes';
import { Request } from 'express';

const generateResponseBody = (message: string, data?: any) => {
  return JSON.stringify({
    message,
    data
  });
}

const generateErrorResponseBody = (message: string, error: any) => {
  if(error && error.message){
    return JSON.stringify({
      errorMessage: error.message,
      error: error,
    })
  }
  return JSON.stringify({
    errorMessage: message,
    error,
  });
}

const getRouteConfigForRequest = (req: Request): Route | null => {
  const requestPathStartsWithConfigPath = (configPath: string) => {
    return req.path.startsWith(configPath);
  }
  const universalMethodRouteConfig = routeConfigs.find(route => 
    requestPathStartsWithConfigPath(route.path) && 
    route.method === '*'
  );

  const routeConfig = routeConfigs.find(route => 
    requestPathStartsWithConfigPath(route.path) && 
    route.method === req.method
  );

  return routeConfig || universalMethodRouteConfig || null;
}

export {
  generateResponseBody,
  generateErrorResponseBody,
  getRouteConfigForRequest,
}