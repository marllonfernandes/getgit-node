const express = require('express')
const app = express()
const workingDirPath = 'c:\\temp\\'
const git = require('simple-git/promise')
const gitSimple = require('simple-git')
const dirPathApp = 'DevOpsTI-API'
const process = require('child-process-promise')
const exec = require('child-process-promise').exec
const moment = require('moment')
const fs = require('fs')
const config = require('./config')
// const ecosystemPM2 = fs.readFileSync('c:\\ecosystem.config.js',{encoding: 'utf-8'})

app.get('/', (req, res, next) => {
    res.end('Welcome to the Build CI NodeJs Application')
})
app.get('/clone', async (req, res, next) => {

    var repository = req.query.repository
    var path = req.query.path
    var application = req.query.application
    var dirDataAtual = moment(new Date(), "YYYY_MM_DD_HH_mm", "pt", true).format("YYYY_MM_DD_HH_mm")

    if (application == null || application == undefined || application == '') {
        res.json({ message: 'Inválid application!' })
        return
    }

    if (repository == null || repository == undefined || repository == '') {
        if (application == 'back') {
            repository = config.repoBack
        } else {
            if (application == 'fronts') {
                repository = config.repoFrontS
            } else {
                repository = config.repoFrontA
            }
        }
    }

    if (path == null || path == undefined || path == '') {
        if (application == 'back') {
            path = config.pathApplicationBack
        } else {
            path = config.pathApplicationFront
        }
    }

    if (!fs.existsSync(`${path}${dirDataAtual}`)) {
        fs.mkdirSync(`${path}${dirDataAtual}`);
    }

    try {
        var clone = await git(`${path}${dirDataAtual}`).clone(repository)
        if (clone == '') {
            var command = await exec(`cd ${path}${dirDataAtual}\\${repository.split('/')[repository.split('/').length-1]} && npm install`)
            res.json({ messagem: command.stderr ? command.stderr : command.stdout })
        } else {
            res.json({ messagem: clone })
        }
    } catch (error) {
        res.status(500).json({ messagem: error.message })
    }

})

app.get('/install', async (req, res, next) => {
    var command = await exec(`cd ${workingDirPath}${dirPathApp} && npm install`)
    res.end('install')
})

app.get('/pull', async (req, res, next) => {
    res.end('pull repository')
    var resultGilPull = await gitPull(`${workingDirPath}${dirPathApp}`)
    var command = await exec(`cd ${workingDirPath}${dirPathApp} && npm install && npm start`)
})

app.get('/started', async (req, res, next) => {
    try {
        exec(`cd ${workingDirPath}${dirPathApp} && npm start`)
        // exec(`${__dirname}\\started_app.bat`)
        res.json({ message: 'ok' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

gitPull = (pathApp) => {
    return new Promise((resolve, reject) => {
        gitSimple(pathApp)
            .pull((err, update) => {
                if (update && update.summary.changes) {
                    resolve(update)
                } else {
                    resolve(err)
                }
            })
    })
}

app.listen(8091, () => { console.log('started application on port 8091') })