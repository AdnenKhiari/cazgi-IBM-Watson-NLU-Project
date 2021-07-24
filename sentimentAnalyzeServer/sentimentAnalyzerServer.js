const express = require('express');
const app = new express();
const cors_app = require('cors');

require('dotenv').config()

app.use(express.static('client'))
app.use(cors_app());

function getNLUInstance(){
    let api_key = process.env.API_KEY
    let api_url = process.env.API_URL
    const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1")
    const {IamAuthenticator} = require("ibm-watson/auth")
    const instance = new NaturalLanguageUnderstandingV1({
        version : '2020-08-01',
        authenticator :  new IamAuthenticator({
            apikey : api_key
        }),
        serviceUrl : api_url
    })
    return instance
}


app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const params = {
        url : req.query.url,
        features : {
              emotion: {}
          }
    }

    getNLUInstance().analyze(params).then((data) => JSON.stringify(data.result.emotion.document.emotion) ).then((data)=> res.send(data) ).catch((err)=> res.status(422).send((err.body)))
   });


app.get("/url/sentiment", (req,res) => {
    const params = {
        url : req.query.url,
        features : {
              sentiment: {}
          }
    }
    getNLUInstance().analyze(params).then((data) => JSON.stringify(data.result.sentiment.document) ).then((data)=> res.send(data) ).catch((err)=> res.status(422).send((err.body)))
   
});

app.get("/text/emotion", (req,res) => {
    const params = {
        text : req.query.text,
        features : {
              emotion: {}
          }
    }
   
    getNLUInstance().analyze(params).then((data) => JSON.stringify(data.result.emotion.document.emotion))
    .then((data)=> res.send(data))
    .catch((err)=> res.status(422).send((err.body)))
   });

app.get("/text/sentiment", (req,res) => {
    const params = {
        text : req.query.text,
        features : {
              sentiment: {}
          }
    }
    getNLUInstance().analyze(params).then((data) => JSON.stringify(data.result.sentiment.document) ).then((data)=> res.send(data) ).catch((err)=> res.status(422).send(err.body))
   
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

