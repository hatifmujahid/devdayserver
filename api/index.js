const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');;
const ftp = require('basic-ftp');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const { getCompetitionDetails, getCsComp, getGenComp, getRoboComp, getEsportsComp, getCompetitionID, getBill } = require('./competition');
const { sendEmail_Cash, sendEmail_Social  } = require('./Email');

dotenv.config({ path: '../.env' });
const { Readable } = require('stream');
const { stringify } = require('querystring');
const { send } = require('process');

const app = express();
const port = 5000;

app.use(cors({
  origin: '*'
}));

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
  mem3_name: String,
  mem3_email: String,
  mem3_whatsapp_number: String,
  mem3_cnic: String,
  mem4_name: String,
  mem4_email: String,
  mem4_whatsapp_number: String,
  mem4_cnic: String,
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
  },
  Filled_by: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  Payment_Mode: {
    type: String,
    required: true
  }
});

const SocialEventSchema = new mongoose.Schema({
  cnic: {
    type: String,
    required: true
  },
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
  isParticipant: {
    type: Boolean,
    required: true
  },
  fees_amount: {
    type: Number,
    required: true
  },
  ticketID: {
    type: String,
    required: true
  },
  filled_by: {
    type: String,
    required: true
  }
})

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
  abstract : {
    type: String,
    required: true
  },
  features : {
    type: String,
    required: true
  },
  uniqueness : {
    type: String,
    required: true
  },
  fees_amount: {
    type: String,
    required: true
  },
  paid: {
    type: Boolean,
    required: true,
    default: false
  },
  reference_code: {
    type: String
  },
  university_name: String
});

const cashUserSchema = new mongoose.Schema({
  referenceCode: String,
  email: String,
  name: String,
  id: String,
  password: String,
  // arrayy of participants that have registered consumer Number
  participants: [String]
})

const Participant = mongoose.model('Participant', participantSchema);
const FYP_Registration = mongoose.model('FYP_Registration', fypRegistrationSchema);
const Ambassador = mongoose.model('Ambassador', ambassadorSchema);
const Payment = mongoose.model('Payment', PaymentSchema);
const CashUser = mongoose.model('CashUser', cashUserSchema);
const SocialEvent = mongoose.model('SocialEvent', SocialEventSchema);

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

function verifyReferenceCode(referenceCode) {

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
  competitionID = competitionID.slice(2);
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
      participantData.Payment_Mode = 'Online';


      for (let i = 1; i <= 4; i++) {
        const fieldName = `mem${i}_cnic`;
        if (participantData[fieldName]) {
          participantData[fieldName] = participantData[fieldName].replace(/-/g, "");
        }
      }

      for (let i = 1; i <= 4; i++) {
        const fieldName = `mem${i}_whatsapp_number`;
        if (participantData[fieldName]) {
          participantData[fieldName] = participantData[fieldName].replace(/-/g, "");
        }
      }

      const file = participantData.image;
      //console.log(file) 

      await uploadImage(file, `${participantData.Leader_cnic}_${participantData.Leader_name}_${participantData.Competition}_${participantData.Leader_whatsapp_number}`, "PaymentReceipts");


      participantData.referenceCode = participantData.reference_code.toUpperCase();
      
      const participant = new Participant(participantData);
      const savedParticipant = await participant.save();
      
      // let currentDate = new Date();
      // let dueDate = new Date(currentDate)

      // if (dueDate.getDate() <= 8) {
      //   dueDate.setDate(10);
      // }
      // else {
      //   dueDate.setDate(currentDate.getDate() + 2);
      // }

      // let formattedDueDate = dueDate.toISOString().slice(0, 10).replace(/-/g, '');


      // let billAmount = bill < 999 ? "00000000" + bill + "00" : "0000000" + bill + "00";

      // let billAfterDueDate = (bill * 1.2) < 999 ? "00000000" + (bill * 1.2) + "00" : "0000000" + (bill * 1.2) + "00";	

      // const payment = new Payment({
      //   consumer_number: consumerNumber,
      //   consumer_detail: participantData.Leader_name,
      //   bill_status: 'U',
      //   due_date: formattedDueDate,
      //   amount_within_dueDate: billAmount,
      //   amount_after_dueDate: billAfterDueDate,
      //   billing_month: '2404',
      //   date_paid: "        ", // 8 whitespaces
      //   tran_auth_id: "      ", // 6 whitespaces
      //   amount_paid: "            ", // 12 whitespaces
      //   reserved: "",
      //   identification_parameter: "",
      //   transaction_amount: "",
      //   tran_date: "",
      //   tran_time: "",
      //   bank_mnemonic: ""
      // })

      // await payment.save();

      // let data = {
      //   name: participantData.Leader_name,	
      //   consumerNumber: consumerNumber,
      //   email: participantData.Leader_email,
      //   dueDate: formattedDueDate,
      //   bill: bill,
      //   billAfterDueDate: bill*1.2,
      //   competition: participantData.Competition,
      // }

      // await sendEmail_ConsumerNumber(data);
      
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

// a route to get the details of all the socials


app.post('/cashLogin', async (req, res) => {
  try {
    const data = req.body;
    const user = await CashUser.findOne({id: data.id, password: data.password});
    if (user) {
      const token = jwt.sign({ id: user.id }, 'ACM_bohat_kaam_karati_hai', { expiresIn: '2h' });
      res.send({
        token: token,
        success: true,
      });
    }
    else {
      res.send({
        success: false,
        message: 'Invalid credentials',
      });
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
})

const verifySession = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'ACM_bohat_kaam_karati_hai', (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized');
    }
    req.user = decoded;
    next();
  });
} 

app.get("/verifyCashSession", verifySession, (req, res) => {
  res.send({
    success: true,
    message: 'Verified'
  });
})

app.post('/cashRegister',verifySession , async (req, res) => {

  try {
    let participantData = req.body;
    
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
      participantData.Payment_Mode = 'Cash';

      participantData.paid = true;

      participantData.Filled_by = req.user.id;

      // const user = CashUser.findOne({referenceCode: participantData.reference_code, id: req.user.id});
      // if (user) {
      //   user.participants.push(consumerNumber);
      //   await user.save();
      // }
        
      const participant = new Participant(participantData);
      const savedParticipant = await participant.save();

      await sendEmail_Cash({
        name: participantData.Leader_name,
        email: participantData.Leader_email,
        competition: participantData.Competition,
        bill: bill,
        team: participantData.Team_Name,
      });
      
      res.send({
        success: true,
        message: 'Participant added successfully',
      });
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error saving participant');
  }
})

app.get('/getSocials', verifySession ,async (req, res) => {
  try {
    const socials = await SocialEvent.find({});
    res.send(socials);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching socials');
  }
})

async function isParticipant(cnic) {
  // Remove dashes from the input CNIC
  const formattedInputCnic = cnic.replace(/-/g, '');
  
  // Define a regex pattern to match the formatted input CNIC with any number of dashes in the database CNICs
  const regexPattern = formattedInputCnic.split('').join('-?');

  // Search for the participant by matching the formatted input CNIC with any number of dashes removed in the database
  const participant = await Participant.findOne({
    $or: [
      { Leader_cnic: { $regex: regexPattern } },
      { mem1_cnic: { $regex: regexPattern } },
      { mem2_cnic: { $regex: regexPattern } },
      { mem3_cnic: { $regex: regexPattern } },
      { mem4_cnic: { $regex: regexPattern } }
    ]
  });

  // If participant not found, return null
  if (!participant) {
    return null;
  }

  // Determine the CNIC field that matches the input CNIC
  let matchingCNICField;
  if (participant.Leader_cnic && participant.Leader_cnic.replace(/-/g, '') === formattedInputCnic) {
    matchingCNICField = 'Leader';
  } else {
    for (let i = 1; i <= 4; i++) {
      const memCNIC = participant[`mem${i}_cnic`];
      if (memCNIC && memCNIC.replace(/-/g, '') === formattedInputCnic) {
        matchingCNICField = `mem${i}`;
        break;
      }
    }
  }

  // Prepare the data to return based on the matching CNIC field
  let data = null;
  if (matchingCNICField) {
    data = {
      name: participant[`${matchingCNICField}_name`],
      email: participant[`${matchingCNICField}_email`],
      whatsapp_number: participant[`${matchingCNICField}_whatsapp_number`],
      cnic: participant[`${matchingCNICField}_cnic`],
      consumerNumber: participant.consumerNumber,
      competition: participant.Competition,
      Team_Name: participant.Team_Name,
      Paid: participant.paid
    };
  }

  return data;
}


app.post("/verifyParticipant",verifySession, async (req, res) => {

  try {
    const cnic = req.body.cnic;
    if (cnic === '') {
      res.status(400).send('Incomeplete data');
      return
    }

    console.log(cnic);
    const participant = await isParticipant(cnic);

    if (participant !== null) {

      res.send({
        success: true,
        data: participant,
      });
    }
    else {

      res.status(404).send({
        success: false,
        message: 'Participant not found',
      });
    }
  }
  catch {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }

})

app.post('/addSocialEventParticipant', async (req, res) => {
  try {
    let participantData = req.body;
    if (participantData.name === '' || participantData.email === '' || participantData.whatsapp_number === '' || participantData.cnic === '' || participantData.college === '' || participantData.ticketID==='' || participantData.filled_by === '') {
      res.status(400).send('Incomeplete data');
      return
    }

    let bill = 1000;
    let isPart = false;

    const participant = await isParticipant(participantData.cnic);
    if (participant !== null) {
      isPart = true;
    }

    participantData.fees_amount = bill;
    participantData.isParticipant = isPart;

    const social = await SocialEvent.findOne({cnic: participantData.cnic});

    if (social) {
      res.send({
        success: false,
        message: 'Participant already registered for social event',
      });	
      return;
    }

    if (participantData.isParticipant === false) {
      res.send({
        success: false,
        message: 'Participant not registered for any competition',
      });
      return;
    }

    const socialEvent = new SocialEvent(participantData);
    const savedParticipant = await socialEvent.save();
   

    
    if (savedParticipant) {

      await sendEmail_Social({
        name: participantData.name,
        email: participantData.email,
        ticket: participantData.ticketID,
      });

      res.send({
        success: true,
        message: 'Participant added successfully',
      });
    }
    else {
      res.send({
        success: false,
        message: 'Error saving participant',
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
    const img = req.body.payment_receipt;
    
    await uploadImage(img, `${req.body.Leader_name}_${req.body.Leader_whatsapp_number}_${req.body.Team_Name}`, "FYP_Receipts");
    
    const savedRegistration = await registration.save();

    // Upload the image to the FTP server
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
