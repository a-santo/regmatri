const port = process.env.PORT || 8080;
const host = process.env.HOST || '127.0.0.1';
const express = require('express');
const app = express();
const router = require('./router/main.route');
const path = require('path');
const bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/assets', express.static('assets'));
app.use('/imagens', express.static(path.join(__dirname, 'db/imagens')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function(err) {
    if (!err) {
        console.log('A aplicação está a ser executada em ' + host + ':' + port);
    }
    else {
        console.log(err);
    }
});

app.use('/', router);

module.exports = app;