const express = require('express');
const app = express();
const mongoose = require('mongoose')
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const multipart = require('connect-multiparty');
global.appRoot = path.resolve(__dirname);

const PORT = 3000;

mongoose.connect('mongodb://localhost/stim', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

app.use(cookieParser())
app.use(multipart({ }))

//Per gestire i parametri passati nel corpo della richiesta http.
app.use(express.json());

app.use('/static', express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'))

const routes = require('./src/routes/routes');
routes(app, mongoose, io, require('axios'));

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

server.listen(PORT, function () {
    console.log('Node API server started on port '+PORT);
});
