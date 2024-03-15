const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');;
const ftp = require('basic-ftp');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const { Readable } = require('stream');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
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

//  Name
// email
// WhatsApp number
// university name
// department
// Year of batch
// On a scale of 1-5, how active you are on social media?
// Instagram ID
// Facebook ID
// how would you promote our event on your campus
// how did you know of our BA program(social media, friends, news)
// Past experience
// A checkbox that you agree to perform your ambassador duties whole heartedly and that team DevDay has rights to remove their name off our brand ambassadors list.

const ambassadorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  whatsapp_number: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year_of_batch: {
    type: String,
    required: true
  },
  social_media_activity: {
    type: Number,
    required: true
  },
  instagram_id: {
    type: String,
    required: true
  },
  facebook_id: {
    type: String,
    required: true
  },
  promotion_strategy: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  past_experience: {
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
const Ambassador = mongoose.model('Ambassador', ambassadorSchema);

async function uploadImage(base64Image, imageName) {
  const client = new ftp.Client();

  try {
      await client.access({
          host: 'ftp.nuceskhi.hosting.acm.org',
          user: 'areeb@nuceskhi.hosting.acm.org',
          password: 'e@u4YR]J44TH',
          secure: false // Change to true if you're using FTPS
      });

      // Decode the Base64 image
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Create a readable stream from the buffer
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null); // Indicate the end of the stream

      // Upload the image stream to the FTP server
      await client.uploadFrom(stream, `BrandAmbassadors/${imageName}.png`);

  } catch (err) {
      console.error('Error:', err);
  } finally {
      client.close();
  }
}

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

app.post('/addAmbassador', async (req, res) => {
  try {
      const {
          name,
          email,
          whatsapp_number,
          college,
          department,
          year_of_batch,
          social_media_activity,
          instagram_id,
          facebook_id,
          promotion_strategy,
          source,
          past_experience,
          agree,
          file 
      } = req.body;

      // Upload the image to the FTP server
      await uploadImage(file, `${name}_${college}_${year_of_batch}_${whatsapp_number}`);

      // Create and save the ambassador
      
      const ambassador = new Ambassador({
          name,
          email,
          whatsapp_number,
          college,
          department,
          year_of_batch,
          social_media_activity,
          instagram_id,
          facebook_id,
          promotion_strategy,
          source,
          past_experience
      });

      const savedAmbassador = await ambassador.save();

      res.send({
        success: true,
      });
      
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error saving ambassador');
  }
});

// app.get('/devdaynodeapi/getFYPRegistrations', (req, res) => {
//   FYP_Registration.find((error, results) => {
//     if (error) throw error;
//     res.send(results);
//   });
// });


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
