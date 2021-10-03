require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
const db = require('./config/db');
const cors = require('cors');
const corsOptions = {
    origin:process.env.ALLOWED_CLIENTS.split(','),
};
app.use(cors(corsOptions));
db();
const router = require('./routes/web');
app.use(express.json());
app.use(express.static('public'));
app.set('view engine','ejs');
router(app);
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});