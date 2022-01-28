import { generateErrorResponseBody, getRouteConfigForRequest } from './Helpers';
import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { ClientService } from './services/Client.service';

const authMiddleware = (clientService: ClientService) => async (req: Request, res: Response, next: NextFunction) => {
  const routeConfig = getRouteConfigForRequest(req);
  const authHeader = req.headers.authorization;

  console.log(`AUTH ${req.method} ${req.path}`);

  if(!routeConfig || !routeConfig.authRequired){
    return next();
  }
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    await admin.auth().verifyIdToken(token)
      .then(async (decodedToken) => {
        req.body.client = (await clientService.find({uid: decodedToken.uid}) || [])[0];
        if(!req.body.client){
          res.status(401).send({errorMessage: 'Unauthorized'});
        }
        next();
      })
      .catch(err => {
        res.status(401).send({errorMessage: 'Unauthorized', error: err});
      });
  } else {
    res.status(401).send({errorMessage: 'Unauthorized'});
  }
}

const requestLoggerMiddleware = () => (req: Request, res: Response, next: NextFunction) => {
  console.log(`REQUEST ${req.method} ${req.path}`);

  res.on('finish', () => {
    console.log(`RESPONSE ${req.method} ${req.path} ${res.statusCode}`);
  });

  next();
}

const requestDataValidatorMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  const routeConfig = getRouteConfigForRequest(req);
  if(!routeConfig || !routeConfig.bodyValidationSchema){
    return next();
  }

  const validationSchema = routeConfig.bodyValidationSchema;
  const validationResult = validationSchema.validate(req.body);
  if(validationResult.error){
    res.status(400).send({errorMessage: 'Invalid request', error: validationResult.error});
    return;
  }

  next();
}

const errorHandlerMiddleware = () => (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send(generateErrorResponseBody('Something went wrong', err));
}

export {
  authMiddleware,
  requestLoggerMiddleware,
  requestDataValidatorMiddleware,
  errorHandlerMiddleware,
}