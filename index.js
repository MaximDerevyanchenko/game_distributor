const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');

global.appRoot = path.resolve(__dirname);

const PORT = 3000;

mongoose.connect('mongodb://localhost/steam', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

app.use(cors())
app.use(cookieParser())

//Per gestire i parametri passati nel corpo della richiesta http.
app.use(express.json());

app.use('/static', express.static(__dirname + '/public'));

const routes = require('./src/routes/routes');
routes(app);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(PORT, function () {
    console.log('Node API server started on port '+PORT);
});
