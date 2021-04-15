const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const compression = require('compression');

const sendGrid = require('@sendGrid/mail');


const app = express();

app.use(express.static(path.join(__dirname, 'wwwroot')));
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'wwwroot', 'index.html'));
})

app.use(bodyParser.json());

app.use(cors());

app.use(compression());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change later to only allow our server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.get('/api', (req, res, next) => {
    res.send('API Status: Running')
});


app.post('/api/email', (req, res, next) => {

    console.log(req.body);

    sendGrid.setApiKey(`${process.env.SENDGRID_KEY}`);
    const msg = {
        to: 'movinest.app@gmail.com',
        from: 'movinest.app@gmail.com',
        subject: 'Portfolio Website Contact',
        text: 'FROM: ' + req.body.email + ' MESSAGE: ' + req.body.message
    }

    sendGrid.send(msg)
        .then(result => {

            res.status(200).json({
                success: true
            });

        })
        .catch(err => {

            console.log('error: ', err);
            res.status(401).json({
                success: false
            });

        });
});

app.listen(process.env.PORT || 3030);
