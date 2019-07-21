const express = require('express')
const app = express()
const workingDirPath = 'c:\\temp\\'
const git = require('simple-git/promise')
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

app.get('/pull', (req, res, next) => {
    res.end('pull repository')
    git(`${workingDirPath}${dirPathApp}`)
        .pull((err, update) => {
            if (update && update.summary.changes) {
                console.log('err', err)
                console.log('update', update)
                process.exec('npm install');
            }
        });
})
app.listen(8091, () => { console.log('started application on port 8091') })