let http = require('http');
let fs = require('fs');
let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();

let homePage = path.join(__dirname, '..', 'client', 'index.html');
let chirpHistory = path.join(__dirname, 'data.json');
let clientPath = path.join(__dirname, '../client');

app.use(bodyParser.json());
app.use(express.static(clientPath));

app.route('/')
    .get((req, res) => {
        res.set('Content-type', 'html');
        res.sendFile(homePage);
    });

app.route('/api/chirps')
    .get((req, res) => {
        res.set('Content-type', 'application/json');
        res.sendFile(chirpHistory);
    }).post((req, res) => {
        fs.readFile(chirpHistory, (err, data) => {
            let chirpFeed = JSON.parse(data);

            chirpFeed.push(req.body);
            newFeed = JSON.stringify(chirpFeed);
            fs.writeFile(chirpHistory, newFeed, function(err) {
                res.status(201).set('Content-type', 'application/json');
                res.send();
            });
        })
    });

app.route('/:id')
    .get((req, res) => {
        let address = req.params.id;
        let ext = path.extname(req.params.id);
        let extTrim = ext.substr(1,ext.length);
        let extOp = `text/${extTrim}`;

        fs.readFile(address, (err) => {
            if (err) {
                res.status(404).send('Not Found');
            }
            res.status(201).set('Content-type', extOp);
            res.send(address)
        })
    });

app.listen(3000);