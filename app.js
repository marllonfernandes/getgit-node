const express = require('express')
const app = express()
const git = require('simple-git/promise')
const gitSimple = require('simple-git')
const process = require('child-process-promise')
const exec = require('child-process-promise').exec
const moment = require('moment')
const fs = require('fs')
const config = require('./config')
const { zip } = require('zip-a-folder')

// const ecosystemPM2 = fs.readFileSync('c:\\ecosystem.config.js',{encoding: 'utf-8'})

app.get('/', (req, res, next) => {
    res.end('Welcome to the Build CI NodeJs Application')
})
// app.get('/clone', async (req, res, next) => {

//     var repository = req.query.repository
//     var path = req.query.path
//     var application = req.query.application
//     var dirDataAtual = moment(new Date(), "YYYY_MM_DD_HH_mm", "pt", true).format("YYYY_MM_DD_HH_mm")

//     if (application == null || application == undefined || application == '') {
//         res.json({ message: 'Inválid application!' })
//         return
//     }

//     if (repository == null || repository == undefined || repository == '') {
//         if (application == 'back') {
//             repository = config.repoBack
//         } else {
//             if (application == 'fronts') {
//                 repository = config.repoFrontS
//             } else {
//                 repository = config.repoFrontA
//             }
//         }
//     }

//     if (path == null || path == undefined || path == '') {
//         if (application == 'back') {
//             path = config.pathApplicationBack
//         } else {
//             path = config.pathApplicationFront
//         }
//     }

//     if (!fs.existsSync(`${path}${dirDataAtual}`)) {
//         fs.mkdirSync(`${path}${dirDataAtual}`);
//     }

//     try {
//         var clone = await git(`${path}${dirDataAtual}`).clone(repository)
//         if (clone == '') {
//             var command = await exec(`cd ${path}${dirDataAtual}\\${repository.split('/')[repository.split('/').length - 1]} && npm install`)
//             res.json({ messagem: command.stderr ? command.stderr : command.stdout })
//         } else {
//             res.json({ messagem: clone })
//         }
//     } catch (error) {
//         res.status(500).json({ messagem: error.message })
//     }

// })

app.get('/pull', async (req, res, next) => {

    var repository = ''
    var path = ''
    var application = req.query.application
    var idapp = ''
    var dirDataAtual = moment(new Date(), "YYYYMMDDHHmm", "pt", true).format("YYYYMMDDHHmm")

    if (application == null || application == undefined || application == '') {
        res.json({ message: 'Inválid application!' })
        return
    }

    if (application == 'back') {
        repository = config.repoBack
        path = config.pathApplicationBack
        idapp = config.idPm2Back
    } else {
        path = config.pathApplicationFront
        idapp = config.idPm2Front
        if (application == 'fronts') {
            repository = config.repoFrontS
        } else {
            repository = config.repoFrontA
        }
    }

    var diretorioOrigem = `${path}\\${repository.split('/')[repository.split('/').length - 1]}`
    var fileDestino = `${path}${repository.split('/')[repository.split('/').length - 1]}-bkp${dirDataAtual}.zip`

    // faz backup da aplicacao
    if (fs.existsSync(diretorioOrigem)) {
        await zip(diretorioOrigem, fileDestino);
    } else {
        await git(path).clone(repository)
    }
    // baixa do git os arquivos atualizados
    var resultGilPull = await gitPull(diretorioOrigem)

    if (!resultGilPull == null || !resultGilPull == undefined) {
        // instala os pacotes e reinicia aplicacao
        var command = await exec(`cd ${diretorioOrigem} && npm install && pm2 restart ${idapp}`)
        res.json({ message: 'Successfully updated application!' })
    } else {
        res.json({ message: 'There was no application update!' })
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