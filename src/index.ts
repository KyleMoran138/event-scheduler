import express, { NextFunction, Request, Response } from 'express';
import { ClientService } from './services/Client.service';
import ScheduledEventService from './services/ScheduledEvent.service';
import mongoose from 'mongoose';

const config = require('dotenv').config();
const app = express();
const MONGO_CONNECTION_URI = config.parsed.MONGO_CONNECTION_URI;
const clientService = new ClientService();
const scheduledEventService = new ScheduledEventService();

if (!MONGO_CONNECTION_URI) {
  throw new Error('MONGO_CONNECTION_URI is not defined');
}

mongoose.connect(MONGO_CONNECTION_URI);

app.use(express.json());

//async post endpoint to create a new client
app.post('/client', async (req, res) => {
  //validate body to ensure required fields are present
  if (!req.body.name) {
    res.status(400).send('Name is required');
    return;
  }
  if (!req.body.email) {
    res.status(400).send('Email is required');
    return;
  }

  try {
    const client = await clientService.createClient(req.body.name, req.body.email);
    res.send(client);
  } catch (error) {
    res.status(500).send(error);
  }
});

//middleware to handle all exceptions
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});