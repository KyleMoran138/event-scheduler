import express, { NextFunction, Request, Response } from 'express';
import { ClientService } from './services/Client.service';
import ScheduledEventService from './services/ScheduledEvent.service';
import { App, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { FirebaseApp, initializeApp } from '@firebase/app';
import mongoose from 'mongoose';
import { getAuth } from 'firebase/auth';
import { Client } from './models/Client.model';
import { generateErrorResponseBody, generateResponseBody } from './Helpers';
import { authMiddleware, requestDataValidatorMiddleware, requestLoggerMiddleware } from './Middlewears';


// app vars
const config = require('dotenv').config();
const app = express();
let firebaseAdminApp: App;
let firebaseApp: FirebaseApp;


// declare env consts
const serverConfigs = {
  MONGO_CONNECTION_URI: config.parsed.MONGO_CONNECTION_URI,
  SERVER_PORT: config.parsed.PORT || 3000,
  FIREBASE_TYPE: config.parsed.FIREBASE_TYPE,
  FIREBASE_PROJECT_ID: config.parsed.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID: config.parsed.FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY: config.parsed.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: config.parsed.FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID: config.parsed.FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI: config.parsed.FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI: config.parsed.FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL: config.parsed.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL: config.parsed.FIREBASE_CLIENT_X509_CERT_URL,
  FIREBASE_API_KEY: config.parsed.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: config.parsed.FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET: config.parsed.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: config.parsed.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: config.parsed.FIREBASE_APP_ID,
};

//check if env vars are defined
for (const [varName, envVar] of Object.entries(serverConfigs)) {
  if (!envVar) {
    throw new Error(`${varName} is not defined`);
  }
}

// create services
let clientService: ClientService; 
let scheduledEventService: ScheduledEventService; 


const startServer = async () => {
  console.log('Connecting to database...');
  await mongoose.connect(serverConfigs.MONGO_CONNECTION_URI);
  console.log('Connected to database');

  console.log('Connecting to firebase admin...');

  firebaseAdminApp = initializeAdminApp({
    credential: admin.credential.cert({
      // @ts-ignore
      type: serverConfigs.FIREBASE_TYPE,
      project_id: serverConfigs.FIREBASE_PROJECT_ID,
      private_key_id: serverConfigs.FIREBASE_PRIVATE_KEY_ID,
      private_key: serverConfigs.FIREBASE_PRIVATE_KEY,
      client_email: serverConfigs.FIREBASE_CLIENT_EMAIL,
      client_id: serverConfigs.FIREBASE_CLIENT_ID,
      auth_uri: serverConfigs.FIREBASE_AUTH_URI,
      token_uri: serverConfigs.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: serverConfigs.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: serverConfigs.FIREBASE_CLIENT_X509_CERT_URL
    }),
  });
  console.log('Connected to firebase admin');

  console.log('Connecting to firebase app...');
  firebaseApp = initializeApp({
    apiKey: serverConfigs.FIREBASE_API_KEY,
    authDomain: serverConfigs.FIREBASE_AUTH_DOMAIN,
    projectId: serverConfigs.FIREBASE_PROJECT_ID,
    storageBucket: serverConfigs.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: serverConfigs.FIREBASE_MESSAGING_SENDER_ID,
    appId: serverConfigs.FIREBASE_APP_ID,
  });
  console.log('Connected to firebase app');

  console.log('Initializing services...');
  clientService = new ClientService(getAuth(firebaseApp));
  scheduledEventService = new ScheduledEventService(clientService);
  console.log('Services initialized');

  console.log('Setting up middleware...');
  app.use(express.json());
  app.use(requestLoggerMiddleware());
  app.use(requestDataValidatorMiddleware());
  app.use(authMiddleware(clientService));
  console.log('Middleware setup');

  app.on('exit', (() => {
    console.log('Closing server...');
    mongoose.disconnect();
    console.log('Server closed');
  }));

  console.log('Setting up routes...');
  setUpRoutes();
  console.log('Routes setup');

  console.log('Starting server...');
  app.listen(serverConfigs.SERVER_PORT, async () => {
    console.log('Server started');
    console.log(`Server listening on port ${serverConfigs.SERVER_PORT}`);
  });
};

const setUpRoutes = () => {
  // CLIENT ROUTES
  app.post('/client', async (req, res) => {
    if (!req.body.name) {
      res.status(400).send('Name is required');
      return;
    }
    if (!req.body.email) {
      res.status(400).send('Email is required');
      return;
    }
    if(!req.body.password){
      res.status(400).send('Password is required');
      return;
    }

    try {
      const client = await clientService.createClient(req.body.name, req.body.email, req.body.password);
      res.send(client);
    } catch (error) {
      res.status(500).send(JSON.stringify({errorMessage: 'Something went wrong', error: error}));
    }
  });

  app.post('/client/login', async (req, res) => {
    if (!req.body.email) {
      res.status(400).send('Email is required');
      return;
    }
    if(!req.body.password){
      res.status(400).send('Password is required');
      return;
    }

    try {
      const client = await clientService.loginClient(req.body.email, req.body.password);
      res.send(JSON.stringify({token: client?.token}));
    } catch (error) {
      res.status(500).send(JSON.stringify({errorMessage: 'Something went wrong', error}));
    }
  });

  // EVENT ROUTES
  app.get('/events', async (req, res) => {
    try {
      const client = req.body.client as Client;
      const events = await scheduledEventService.getAllScheduledEvents(client._id.toString());
      res.send(events);
    } catch (error) {
      res.status(500).send(JSON.stringify({errorMessage: 'Something went wrong', error}));
    }
  });

  app.get('/events/:id', async (req, res) => {
    try {
      const event = await scheduledEventService.getScheduledEventById(req.body.clientId, req.params.id);
      res.send(event);
    } catch (error) {
      res.status(500).send(generateErrorResponseBody('Soemthing went wrong', error));
    }
  });

  app.post('/events', async (req, res) => {
    try {
      // const client = req.body.client as Client;
      // const event = await scheduledEventService.createScheduledEvent(client._id.toString(), req.body.event);
      // res.send(event);
      res.send('Not implemented');
    } catch (error) {
      res.status(500).send(generateErrorResponseBody('Soemthing went wrong', error));
    }
  });
}

startServer();