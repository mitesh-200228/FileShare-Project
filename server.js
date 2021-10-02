require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
const db = require('../backend/config/db');
const router = require('./routes/web');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.static('public'));
app.set('view engine','ejs');
db();
router(app);
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});