exports.validacao = (req, res, next) => {
    req.check("id", "Inválid id!").exists()
    var erros = req.validationErrors()
    if (erros) {
        return res.status(400).json({ erros })
    } else {
        next()
    }
}

exports.api = (req, res, next) => {
    res.end('Welcome to the Build CI NodeJs Application')
}

exports.pull = async (req, res, next) => {
    try {
        var repository = ''
        var path = ''
        var id = req.query.id
        var forceRestart = req.query.forcerestart == null || req.query.forcerestart == undefined ? false : req.query.forcerestart
        var moment = req.app.get('moment')
        var Pm2 = req.app.get('Pm2')
        var fs = req.app.get('fs')
        var zip = req.app.get('zip')
        var exec = req.app.get('exec')
        var Git = req.app.get('Git')
        var dirDataAtual = moment(new Date(), "YYYYMMDDHHmm", "pt", true).format("YYYYMMDDHHmm")
        var processosPM2 = await new Pm2().list()

        processosPM2.forEach(element => {
            if (element.pm_id == id) {
                path = element.pm2_env.pm_cwd
                repository = element.pm2_env.env.REPOSITORY
            }
        })

        if (path == null || path == undefined || path == '') {
            res.status(400).json({ message: 'Id not found!' })
            return
        }

        if (repository == null || repository == undefined || repository == '') {
            res.status(400).json({ message: 'Repository not found!' })
            return
        }

        var diretorioOrigem = `${path}\\`
        var fileDestino = `${path}-bkp${dirDataAtual}.zip`

        // faz backup da aplicacao
        if (fs.existsSync(diretorioOrigem)) {
            console.log('fazendo backup...')
            await zip(diretorioOrigem, fileDestino);
        } else {
            await new Git(path).clone(repository)
            console.log('clonando repositorio...')
        }
        // baixa do git os arquivos atualizados
        console.log('baixando atualizações no repositorio...')
        var pull = await new Git(path).pull(diretorioOrigem)

        if (!pull == null || !pull == undefined || forceRestart) {
            // instala os pacotes e reinicia aplicacao
            console.log('instalando pacotes/dependencias...')
            await exec(`cd ${diretorioOrigem} && npm install`)
            // reinicia aplicacao
            console.log('reiniciando aplicação...')
            if (await new Pm2().restart(id)) {
                res.json({ message: 'Application updated and successfully restarted!' })
            } else {
                res.json({ message: 'Application restart failed!' })
            }
        } else {
            res.json({ message: 'There was no application update!' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}