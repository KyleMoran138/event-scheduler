import express, { NextFunction, Request, Response } from 'express';
import { ClientService } from './services/Client.service';
import ScheduledEventService from './services/ScheduledEvent.service';
import { App, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { FirebaseApp, initializeApp } from '@firebase/app';
import mongoose from 'mongoose';
import { getAuth } from 'firebase/auth';


// app vars
const config = require('dotenv').config();
const app = express();
let firebaseAdminApp: App;
let firebaseApp: FirebaseApp;


// declare env consts
const MONGO_CONNECTION_URI = config.parsed.MONGO_CONNECTION_URI;
const SERVER_PORT = config.parsed.PORT || 3000;
const FIREBASE_TYPE = config.parsed.FIREBASE_TYPE
const FIREBASE_PROJECT_ID = config.parsed.FIREBASE_PROJECT_ID
const FIREBASE_PRIVATE_KEY_ID = config.parsed.FIREBASE_PRIVATE_KEY_ID
const FIREBASE_PRIVATE_KEY = config.parsed.FIREBASE_PRIVATE_KEY
const FIREBASE_CLIENT_EMAIL = config.parsed.FIREBASE_CLIENT_EMAIL
const FIREBASE_CLIENT_ID = config.parsed.FIREBASE_CLIENT_ID
const FIREBASE_AUTH_URI = config.parsed.FIREBASE_AUTH_URI
const FIREBASE_TOKEN_URI = config.parsed.FIREBASE_TOKEN_URI
const FIREBASE_AUTH_PROVIDER_X509_CERT_URL = config.parsed.FIREBASE_AUTH_PROVIDER_X509_CERT_URL
const FIREBASE_CLIENT_X509_CERT_URL = config.parsed.FIREBASE_CLIENT_X509_CERT_URL
const FIREBASE_API_KEY = config.parsed.FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = config.parsed.FIREBASE_AUTH_DOMAIN;
const FIREBASE_STORAGE_BUCKET = config.parsed.FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = config.parsed.FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = config.parsed.FIREBASE_APP_ID;

// check env vars
if (!MONGO_CONNECTION_URI) {
  throw new Error('MONGO_CONNECTION_URI is not defined');
}

if(!FIREBASE_TYPE || !FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL || !FIREBASE_CLIENT_ID || !FIREBASE_AUTH_URI || !FIREBASE_TOKEN_URI || !FIREBASE_AUTH_PROVIDER_X509_CERT_URL || !FIREBASE_CLIENT_X509_CERT_URL || !FIREBASE_API_KEY || !FIREBASE_AUTH_DOMAIN || !FIREBASE_STORAGE_BUCKET || !FIREBASE_MESSAGING_SENDER_ID || !FIREBASE_APP_ID){
  throw new Error('FIREBASE CONFIG VARIABLES MISSING');
}

// create services
let clientService: ClientService; 
let scheduledEventService: ScheduledEventService; 

app.use(express.json());

// create array of paths that require authentication
const authPaths = [
  '/product',
];

app.use((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const isAuthPath = authPaths.findIndex(authPath => req.path.startsWith(authPath)) !== -1;

  if(!isAuthPath){
    next();
    return;
  }
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    admin.auth().verifyIdToken(token)
      .then(decodedToken => {
        // set request.body.user to result of getClient
        return clientService.getClient(decodedToken.uid);
        
        next();
      })
      .catch(err => {
        res.status(401).send(err);
      });
  } else {
    res.status(401).send('No token provided');
  }
});

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
    res.send(JSON.stringify(client?.token));
  } catch (error) {
    res.status(500).send(JSON.stringify({errorMessage: 'Something went wrong', error}));
  }
});

// create product get endpoint that returns empty json object
app.get('/product', (req, res) => {
  res.send({});
});



app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send(JSON.stringify({errorMessage: 'Something went wrong', error: err}));
});


app.listen(SERVER_PORT, async () => {
  console.log('Connecting to database...');
  await mongoose.connect(MONGO_CONNECTION_URI);
  console.log('Connected to database');

  console.log('Connecting to firebase admin...');

  firebaseAdminApp = initializeAdminApp({
    credential: admin.credential.cert({
      // @ts-ignore
      type: FIREBASE_TYPE,
      project_id: FIREBASE_PROJECT_ID,
      private_key_id: FIREBASE_PRIVATE_KEY_ID,
      private_key: FIREBASE_PRIVATE_KEY,
      client_email: FIREBASE_CLIENT_EMAIL,
      client_id: FIREBASE_CLIENT_ID,
      auth_uri: FIREBASE_AUTH_URI,
      token_uri: FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL
    }),
  });
  console.log('Connected to firebase admin');

  console.log('Connecting to firebase app...');
  firebaseApp = initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  });
  console.log('Connected to firebase app');

  console.log('Initializing services...');
  clientService = new ClientService(getAuth(firebaseApp));
  scheduledEventService = new ScheduledEventService();
  console.log('Services initialized');
  
  console.log(`Server listening on port ${SERVER_PORT}`);
});