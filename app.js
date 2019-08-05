const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const expressValidator = require('express-validator')
const load = require('express-load')
const exec = require('child-process-promise').exec
const moment = require('moment')
const fs = require('fs')
const { zip } = require('zip-a-folder')
const Pm2 = require('./factory/pm2')
const Git = require('./factory/git')
const Directory = require('./factory/copydir')

const allowCors = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // colocar os dominios permitidos | ex: 127.0.0.1:3000
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, X-Access-Token, X-Key");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  }

//rest API requirements
app.use(allowCors)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(expressValidator())

app.set('moment',moment)
app.set('path',path)
app.set('exec',exec)
app.set('fs',fs)
app.set('zip',zip)
app.set('Pm2',Pm2)
app.set('Git',Git)
app.set('Directory',Directory)

// Autoload Configuration.
load('controllers').then('routes').into(app)

app.listen(4000, () => { console.log('started application on port 4000') })