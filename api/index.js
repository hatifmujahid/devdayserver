const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define schema and models for Participants, Competition, and FYP_Registration
const participantSchema = new mongoose.Schema({
  Team_Name: {
    type: String,
    required: true
  },
  Leader_name: {
    type: String,
    required: true
  },
  Leader_email: {
    type: String,
    required: true
  },
  Leader_whatsapp_number: {
    type: String,
    required: true
  },
  mem1_name: String,
  mem1_email: String,
  mem1_whatsapp_number: String,
  mem2_name: String,
  mem2_email: String,
  mem2_whatsapp_number: String,
  fees_amount: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  reference_code: {
    type: String,
    required: true
  }
});

const fypRegistrationSchema = new mongoose.Schema({
  Team_Name: {
    type: String,
    required: true
  },
  Leader_name: {
    type: String,
    required: true
  },
  Leader_email: {
    type: String,
    required: true
  },
  Leader_whatsapp_number: {
    type: String,
    required: true
  },
  mem1_name: String,
  mem1_email: String,
  mem1_whatsapp_number: String,
  mem2_name: String,
  mem2_email: String,
  mem2_whatsapp_number: String,
  category: {
    type: String,
    required: true
  },
  fees_amount: {
    type: mongoose.Decimal128,
    required: true
  },
  paid: {
    type: Boolean,
    required: true,
    default: false
  },
  reference_code: {
    type: String,
    required: true
  }
});

const Participant = mongoose.model('Participant', participantSchema);
const FYP_Registration = mongoose.model('FYP_Registration', fypRegistrationSchema);

// Routes
app.post('/addParticipant', async (req, res) => {
  try {
    const participant = new Participant(req.body);
    const savedParticipant = await participant.save();
    res.send(savedParticipant);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving participant');
  }
});

app.post('/addFYPRegistration', async (req, res) => {
  try {
    const registration = new FYP_Registration(req.body);
    const savedRegistration = await registration.save();
    res.send(savedRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving FYP registration');
  }
});


// app.get('/devdaynodeapi/getFYPRegistrations', (req, res) => {
//   FYP_Registration.find((error, results) => {
//     if (error) throw error;
//     res.send(results);
//   });
// });

app.get('/', (req, res) => {
  res.send('Hello World!');

});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
// import { MongoClient } from 'mongodb';
// import dotenv from 'dotenv';
// dotenv.config({ path: '../.env' });
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';

// const app = express();
// app.use(cors({origin: 'https://acmdevday.com'}));
// app.use(bodyParser.json());

// const connectionString = process.env.MONGODB_URI || '';
// const client = new MongoClient(connectionString);

// let conn;
// try {
//     conn = await client.connect();
//     console.log('Connected to the database');
// } catch (e) {
//     console.error(e);
// }

// // Define schema and models for Participants, Competition, and FYP_Registration
// const db = client.db(); // Get the default database

// // Define schema and model for Participants
// const participantCollection = db.collection('participants');


// // Define schema and model for FYP_Registration
// const fypRegistrationCollection = db.collection('fyp_registrations');

// // Routes
// app.post('/addParticipant', async (req, res) => {
//     try {
//         const participant = req.body;
//         const result = await participantCollection.insertOne(participant);
//         res.send('Participant added successfully');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error saving participant');
//     }
// });

// app.post('/addFYPRegistration', async (req, res) => {
//     try {
//         const registration = req.body;
//         const result = await fypRegistrationCollection.insertOne(registration);
//         res.send(result.ops[0]);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error saving FYP registration');
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
