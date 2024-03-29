const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');;
const ftp = require('basic-ftp');
const dotenv = require('dotenv');
const { getCompetitionDetails, getCsComp, getGenComp, getRoboComp, getEsportsComp, getCompetitionID, getBill } = require('./competition');
const { sendEmail_ConsumerNumber, sendEmail_PaymentReceived  } = require('./Email');

dotenv.config({ path: '../.env' });
const { Readable } = require('stream');
const { stringify } = require('querystring');

const app = express();
const port = 5000;

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
db.useDb('myFirstDatabase');

// Define schema and models for Participants, Competition, and FYP_Registration
const participantSchema = new mongoose.Schema({
  consumerNumber: {
    type: String,
    required: true
  },
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
  Leader_cnic: {
    type: String,
    required: true
  },
  mem1_name: String,
  mem1_email: String,
  mem1_whatsapp_number: String,
  mem1_cnic: String,
  mem2_name: String,
  mem2_email: String,
  mem2_whatsapp_number: String,
  mem2_cnic: String,
  fees_amount: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  reference_code: String,
  Competition: {
    type: String,
    required: true
  },
  Competition_id: {
    type: String,
    required: true
  },
  Competition_type: {
    type: String,
    required: true
  }
});

const PaymentSchema = new mongoose.Schema({
  consumer_number: {
    type: String,
    required: true
  },
  consumer_detail: String,
  bill_status: String,
  due_date: String,
  amount_within_dueDate: String,
  amount_after_dueDate: String,
  billing_month: String,
  date_paid: String,
  tran_auth_id: String,
  reserved: String,
  transaction_amount: String,
  tran_date: String,
  tran_time: String,
  bank_mnemonic: String,
  identification_parameter: String,
  amount_paid: String,
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
const Payment = mongoose.model('Payment', PaymentSchema);

async function uploadImage(base64Image, imageName, folderName) {
  const client = new ftp.Client();

  try {
      await client.access({
          host: 'ftp.nuceskhi.hosting.acm.org',
          user: 'areeb@nuceskhi.hosting.acm.org',
          password: 'e@u4YR]J44TH',
          secure: false // Change to true if you're using FTPS
      });

      console.log(base64Image)
      // Decode the Base64 image
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Create a readable stream from the buffer
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null); // Indicate the end of the stream

      // Upload the image stream to the FTP server
      console.log("Uploading image")
      console.log(`${folderName}/${imageName}.png`)
      const fileName = `${folderName}/${imageName}.png`.replace(/\s/g, '_');
      await client.uploadFrom(stream, fileName);
      console.log("done")

  } catch (err) {
      console.error('Error:', err);
  } finally {
      client.close();
  }
}

async function verifyReferenceCode(referenceCode) {

  const referenceCodes = ["FAANA20"]
  if (!referenceCode || referenceCode === '') {
    return false;
  }
  if (referenceCode.length !== 7) {
    return false;
  }

  for (let i = 0; i < referenceCodes.length; i++) {
    if (referenceCode === referenceCodes[i]) {
      return true;
    }
  }

  return false;
}

function generateConsumerNumber(cnic, competitionID) {
  const prefix = '00008';
  const middle = cnic.slice(2);
  competitionID = competitionID.slice(1);
  if (competitionID.length === 1) {
    competitionID = '0' + competitionID;
  }
  const suffix = competitionID;
  const consumerNumber = prefix + middle + suffix;
  return consumerNumber;
}

async function checkCompetitionID(competitionID, cnic) {
  const participant = await Participant.findOne({
    Competition_id: competitionID,
    Leader_cnic: cnic
  });

  console.log(participant !== null)

  return participant !== null;
}

app.get('/getCompetitions', async (req, res) => {
  try {
      const csComp = getCsComp();
      const general = getGenComp();
      const robo = getRoboComp();
      const esports = getEsportsComp();

      // Function to count entries for a competition
      const countEntries = async (competitionId) => {
          const count = await Participant.countDocuments({ Competition_id: competitionId });
          return count;
      };

      // Array to store promises for counting entries
      const countPromises = [];

      // Push promises for counting CS Competitions
      for (const comp of csComp) {
          countPromises.push(countEntries(comp.id));
      }

      // Push promises for counting General Competitions
      for (const comp of general) {
          countPromises.push(countEntries(comp.id));
      }

      // Push promises for counting Robotics Competitions
      for (const comp of robo) {
          countPromises.push(countEntries(comp.id));
      }

      for (const comp of esports) {
          countPromises.push(countEntries(comp.id));
      }

      // Wait for all promises to resolve
      const counts = await Promise.all(countPromises);

      // Organize competitions by type based on counts
      const competitionsByType = {
          CS: [],
          General: [],
          Robotics: [],
          Esports: []
      };

      let index = 0;

      // Push competitions to respective type arrays based on counts
      for (const comp of csComp) {
          if (counts[index] < comp.maxEntry) {
              competitionsByType.CS.push(comp);
          }
          index++;
      }

      for (const comp of general) {
          if (counts[index] < comp.maxEntry) {
              competitionsByType.General.push(comp);
          }
          index++;
      }

      for (const comp of robo) {
          if (counts[index] < comp.maxEntry) {
              competitionsByType.Robotics.push(comp);
          }
          index++;
      }

      for (const comp of esports) {
        if (counts[index] < comp.maxEntry) {
            competitionsByType.Esports.push(comp);
        }
        index++;
      }

      res.json(competitionsByType);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});


// Routes
app.post('/addParticipant', async (req, res) => {
  try {
    let participantData = req.body;

    console.log(participantData);
    participantData.Leader_cnic = participantData.Leader_cnic.replace(/-/g, "");

    if (participantData.Leader_name === '' || participantData.Leader_email === '' || participantData.Leader_whatsapp_number === '' || participantData.Leader_cnic === '') {
      res.status(400).send('Incomeplete data');
      return
    }

    const competitionID = getCompetitionID(participantData.Competition);

    if (await checkCompetitionID(competitionID, participantData.Leader_cnic)) {
        res.status(400).send('Participant already registered for this competition');
        return
    }
    else {
      let bill = 0;

      bill = getBill(participantData.Competition);

      if (verifyReferenceCode(participantData.reference_code)) {
         bill = bill - (bill * 0.2);
      }
  
      participantData.fees_amount = bill;

      participantData.paid = false;

      participantData.Leader_cnic = participantData.Leader_cnic.replace(/-/g, "");

      
      
      const competitionId = getCompetitionID(participantData.Competition);
      participantData.Competition_id = competitionId;
      const consumerNumber = generateConsumerNumber(participantData.Leader_cnic, competitionId);
  
      participantData.consumerNumber = consumerNumber;

      const participant = new Participant(participantData);
      const savedParticipant = await participant.save();
      
      let currentDate = new Date();
      let dueDate = new Date(currentDate)

      if (dueDate.getDate() <= 8) {
        dueDate.setDate(10);
      }
      else {
        dueDate.setDate(currentDate.getDate() + 2);
      }

      let formattedDueDate = dueDate.toISOString().slice(0, 10).replace(/-/g, '');


      let billAmount = bill < 999 ? "00000000" + bill + "00" : "0000000" + bill + "00";

      let billAfterDueDate = (bill * 1.2) < 999 ? "00000000" + (bill * 1.2) + "00" : "0000000" + (bill * 1.2) + "00";	

      const payment = new Payment({
        consumer_number: consumerNumber,
        consumer_detail: participantData.Leader_name,
        bill_status: 'U',
        due_date: formattedDueDate,
        amount_within_dueDate: billAmount,
        amount_after_dueDate: billAfterDueDate,
        billing_month: '2404',
        date_paid: "        ", // 8 whitespaces
        tran_auth_id: "      ", // 6 whitespaces
        amount_paid: "            ", // 12 whitespaces
        reserved: "",
        identification_parameter: "",
        transaction_amount: "",
        tran_date: "",
        tran_time: "",
        bank_mnemonic: ""
      })

      await payment.save();

      let data = {
        name: participantData.Leader_name,	
        consumerNumber: consumerNumber,
        email: participantData.Leader_email,
        dueDate: formattedDueDate,
        bill: bill,
        billAfterDueDate: bill*1.2,
        competition: participantData.Competition,
      }

      sendEmail_ConsumerNumber(data);
      
      res.send({
        success: true,
        message: 'Participant added successfully',
      });
    }

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

app.get('/', async (req, res) => {
  res.send('Hi from Dev Day Server!');
})

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
      await uploadImage(file, `${name}_${college}_${year_of_batch}_${whatsapp_number}`, "BrandAmbassadors");

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

app.post('/addPayment', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.send(savedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving payment');
  }
});

app.post('/api/v1/BillInquiry', async (req, res) => {
  try {
    const username = req.get('username');
    const password = req.get('password');
    const { consumer_number, bank_mnemonic, reserved } = req.body;

    // Check if the user is authorized
    if (username !== 'Test' || password !== '@bcd') {
      const error = {
        response_code: '04',
      }
      res.send(error);
    }

    const inquiry = await Payment.findOne({ consumer_number: consumer_number });
    if (!inquiry) {
      const error = {
        response_code: '01',
      }
      res.send(error)
    }
    else{
      const response = {
        response_code: '00',
        consumer_detail: inquiry.consumer_detail,
        bill_status:inquiry.bill_status,
        due_date:inquiry.due_date,
        amount_within_dueDate: '+'+inquiry.amount_within_dueDate,
        amount_after_dueDate: '+'+inquiry.amount_after_dueDate,
        billing_month: "2404",
        date_paid: inquiry.bill_status === 'P' ? inquiry.date_paid : '        ',
        amount_paid: inquiry.bill_status === 'P' ? inquiry.amount_paid : '            ',
        tran_auth_id: inquiry.bill_status === 'P' ? inquiry.tran_auth_id : '      ',
        reserved
      }
      res.send(response);
    }
  } catch (error) {
    console.error('Error:', error);
    const response = {
      response_code: '01',
    }
    res.send(response);
  }

});

app.post('/api/v1/BillPayment', async (req, res) => {
  try {
    const username = req.get('username');
    const password = req.get('password');
    const { consumer_number, tran_auth_id, transaction_amount, tran_date, tran_time, bank_mnemonic, reserved } = await req.body;

    // Check if the user is authorized
    if (username !== 'Test' || password !== '@bcd' || consumer_number === null) {
      const error = {
        response_code: '04',
      }
      res.send(error);
    }
    // let updatedAmount = transaction_amount.slice(7);
    const inquiry = await Payment.findOne({ consumer_number: consumer_number, transaction_amount: transaction_amount});

    if (!inquiry) {
      const error = {
        response_code: '01',
      }
      res.send(error);
    }
    else if(inquiry.bill_status ==='P'){
      const response = {
        response_code: '03',
        identification_parameter: inquiry.identification_parameter,
        reserved
      }
      res.send(response);
    }
    else {
      try {
        
        const updateInquiry = await Payment.updateOne({consumer_number:consumer_number}, {$set: {bill_status:'P', tran_auth_id:tran_auth_id, amount_paid:transaction_amount, date_paid:tran_date, tran_time:tran_time, reserved:reserved}});
        const response = {
          response_code: '00',
          identification_parameter: inquiry.identification_parameter,
          reserved
        }
        res.send(response);
      }
      catch (error){
        console.error('Error:', error);
        const response = {
          response_code: '05',
        }
        res.send(response);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    const response = {
      response_code: '05',
    }
    res.send(response);
  }
});



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
