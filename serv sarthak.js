const express = require('express');
const app = express();
const path = require('path');
const morgan  = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
dotenv.config();
const multer = require("multer");
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const engine = require('consolidate');
const mongoose = require('mongoose');
const cors = require("cors");
const dbConfig = require('./config/dbConfig');
var AWS = require('aws-sdk');

connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan("common"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "public/images")));
const PORT = process.env.PORT || 4000;



AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        
      cb(null, req.body.name);
    },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype == "mime/jpeg" || file.mimetype == "image/png" || file.mimetype == "application/octet-stream"){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter});

app.post("/uploadImage", upload.single("img"), async(req, res, next) => {
    try {
      
      var file = req.file;
      // console.log("Uploading image", file);
      if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next("hey error")
      }
      res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error("Upload image error-", error);
    }
  });

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/manufacturerApi', require('./routes/manufacturerApi'));
app.use('/resellerApi', require('./routes/resellerApi'));
app.use('/userApi', require('./routes/userApi'));
app.use('/crateApi', require('./routes/crateApi'));
app.use('/shiprocketApi', require('./routes/shiprocketApi'));

app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');


app.use(morgan('dev'));



var server = require('http').createServer(app);

server.listen(process.env.PORT || PORT, () => {console.log("Server started at "+PORT)});