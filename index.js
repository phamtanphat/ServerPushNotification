const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3001;

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let options = {
    priority: "high",
    timeToLive: 60 * 60 * 24 
}

app.post('/sendOneDevice', (req, res) => {
    const {token , body} = req.body
    let payload = { data: {body}}
    admin.messaging().sendToDevice(token , payload , options)
    .then(response => res.status(200).send(response))
    .catch(error => res.status(401).send(error))
})

app.post('/sendToAll' , (req, res) => {
    const {token , body} = req.body
    let payload = { data: {body}}
    const arrToken = token.split(",")
    admin.messaging().sendToDevice(arrToken , payload , options)
    .then(response => res.status(200).send(response))
    .catch(error => res.status(401).send(error))
})

app.listen(PORT ,() => console.log('Server started'));