const express = require('express')
const app = express()
const workingDirPath = 'c:\\temp\\'
const git = require('simple-git/promise')
const gitSimple = require('simple-git')
// const repositorio = 'https://github.com/marllonfernandes/DevOpsTI-API.git'
const dirPathApp = 'DevOpsTI-API'
const process = require('child-process-promise')
const exec = require('child-process-promise').exec;

app.get('/', (req, res, next) => {
    res.end('Welcome to the Build CI NodeJs Application')
})
app.get('/clone', async (req, res, next) => {
    if (req.query.repository == null || req.query.repository == undefined || req.query.repository == '') {
        res.status(400).json({ message: 'Inválid repository!' })
    } else {
        try {
            var clone = await git(workingDirPath).clone(req.query.repository)
            if (clone == '') {
                command = await exec(`cd ${workingDirPath}${dirPathApp} && npm install`)
                command = await exec(`cd ${workingDirPath}${dirPathApp} && npm start`)
                if (command.stderr == '') {
                    res.json({ messagem: command.stdout })
                } else {
                    res.json({ messagem: command.stderr })
                }
            } else {
                res.json({ messagem: clone })
            }
        } catch (error) {
            res.status(500).json({ messagem: error.message })
        }
    }
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
        res.json({message: 'ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
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