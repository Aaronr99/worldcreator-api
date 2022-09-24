require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const cors = require('cors')

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Conected to database'))

app.use(express.json())
app.use('/public', express.static(`${__dirname}/images`))


const worldFilter = require('./routes/worldFilters')
const worldRouter = require('./routes/worldRoutes')

app.use('/world', worldFilter)
app.use('/worldDB', worldRouter)

// Https part
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync(`${process.env.ROUTE_KEY}.pem`, 'utf8');
var certificate = fs.readFileSync(`${process.env.ROUTE_CERT}.pem`, 'utf8');

const server = https.createServer({
    key: privateKey,
    cert: certificate
  }, app);
  
server.listen(50000, () => console.log('Https Started'));
//end https

//app.listen(50000, () => console.log('Server Started'));

