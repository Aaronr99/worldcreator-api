const express = require('express');
const app = express();
const mongoose = require('mongoose');

const cors = require('cors')

const corsOptions ={
    origin:'https://aaronr99.github.io/worldcreator-front/', 
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

app.listen(process.env.PORT, () => console.log('Server Started'));

