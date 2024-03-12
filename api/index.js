import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectionString = process.env.MONGOURI || '';
const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
    console.log('Connected to the database');
} catch (e) {
    console.error(e);
}

// Define schema and models for Participants, Competition, and FYP_Registration
const db = client.db(); // Get the default database

// Define schema and model for Participants
const participantCollection = db.collection('participants');
// const participantSchema = {
//     Team_Name: { type: 'string', required: true },
//     Leader_name: { type: 'string', required: true },
//     Leader_email: { type: 'string', required: true },
//     Leader_whatsapp_number: { type: 'string', required: true },
//     mem1_name: 'string',
//     mem1_email: 'string',
//     mem1_whatsapp_number: 'string',
//     mem2_name: 'string',
//     mem2_email: 'string',
//     mem2_whatsapp_number: 'string',
//     fees_amount: { type: 'number', required: true },
//     paid: { type: 'boolean', default: false },
//     reference_code: { type: 'string', required: true }
// };

// Define schema and model for FYP_Registration
const fypRegistrationCollection = db.collection('fyp_registrations');
// const fypRegistrationSchema = {
//     Team_Name: { type: 'string', required: true },
//     Leader_name: { type: 'string', required: true },
//     Leader_email: { type: 'string', required: true },
//     Leader_whatsapp_number: { type: 'string', required: true },
//     mem1_name: 'string',
//     mem1_email: 'string',
//     mem1_whatsapp_number: 'string',
//     mem2_name: 'string',
//     mem2_email: 'string',
//     mem2_whatsapp_number: 'string',
//     category: { type: 'string', required: true },
//     fees_amount: { type: 'decimal128', required: true },
//     paid: { type: 'boolean', required: true, default: false },
//     reference_code: { type: 'string', required: true }
// };

// Routes
app.post('/devdaynodeapi/addParticipant', async (req, res) => {
    try {
        const participant = req.body;
        const result = await participantCollection.insertOne(participant);
        res.send(result.ops[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving participant');
    }
});

app.post('/devdaynodeapi/addFYPRegistration', async (req, res) => {
    try {
        const registration = req.body;
        const result = await fypRegistrationCollection.insertOne(registration);
        res.send(result.ops[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving FYP registration');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
