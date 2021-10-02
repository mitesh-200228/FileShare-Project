const multer = require('multer');
const path = require('path');
const Files = require('../models/file');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../services/emailService');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

let upload = multer({
  storage,
  limits: {
    fileSize: 100000000
  },
}).single('myfile');

function rest() {
  return {
    async FileSubmit(req, res) {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
        const file = new Files({
          filename: req.file.filename,
          uuid: uuidv4(),
          path: req.file.path,
          size: req.file.size
        });
        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
      });
    },
    async Download(req, res) {
      try {
        const file = await Files.findOne({ uuid: req.params.uuid });
        console.log(file);
        if (file) {
          return res.render('download', {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
          });
        }
      } catch (err) {
        return res.render('download', {
          error: 'Something went wrong!!'
        });
      }
    },
    async Dow(req, res) {
      const file = await Files.findOne({ uuid: req.params.uuid });
      if (!file) {
        return res.render('download', {
          error: "Link has been expired!!"
        });
      }

      const filepath = `${__dirname}/../${file.path}`;
      res.download(filepath);
    },
    async Email(req, res) {
      const { uuid, emailTo, emailFrom } = req.body;
      if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).json({ error: 'All fields are required' });
      }
      const file = await Files.findOne({ uuid: uuid });
      if (file.sender) {
        return res.status(422).json({ error: 'Email Already Exist' });
      }
      file.sender = emailFrom;
      file.reciever = emailTo;
      const response = await file.save();

      //send email process

      const msg = {
        to: 'ce20b025@smail.iitm.ac.in',
        from: 'miteshbediya2811@gmail.com', // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: require('../services/emailTemplates')({
          emailFrom: emailFrom,
          downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
          size: parseInt(file.size / 1000) + 'KB',
          expires: '24 hours'
        })
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Sent!!");
        }).catch((error) => {
          console.error(error);
        });


      // sendMail({
      //   from: emailFrom,
      //   to: emailTo,
      //   subject: 'FileShare By Mitesh Bediya',
      //   text: `${emailFrom} shared a file with you`,
      //   html: require('../services/emailTemplates')({
      //     emailFrom: emailFrom,
      //     downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      //     size: parseInt(file.size / 1000) + 'KB',
      //     expires: '24 hours'
      //   })
      // });
    }
  }
}

module.exports = rest;