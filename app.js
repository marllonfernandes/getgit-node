const express = require('express')
const app = express()
const workingDirPath = 'c:\\temp\\'
const simpleGit = require('simple-git')(workingDirPath)
const repositorio = 'https://github.com/marllonfernandes/getgit-node.git'

app.get('/', (req, res, next) => {
    res.end('hello world')
})
app.get('/clone', (req, res, next) => {
    res.end('clone repository')
    simpleGit.clone(repositorio)
})

app.listen(8091, () => { console.log('started application on port 8091') })