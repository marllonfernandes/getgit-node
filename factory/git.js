const git = require('simple-git/promise')
const gitSimple = require('simple-git')

class Git {
    constructor(path) {
        this.path = path
    }
    pull(pathApp) {
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
    async clone(repository){
        return await git(this.path).clone(repository)
    }
}
module.exports = Git