const pm2 = require('pm2')

class PM2 {

    constructor() {

    }
    // constructor(DB) {
    //     this.db = DB;
    // }

    list() {
        return new Promise((resolve, reject) => {
            pm2.list((err, processDescriptionList) => {
                resolve(err ? err : processDescriptionList)
            })
        })
    }
    restart(process) {
        return new Promise((resolve, reject) => {
            pm2.restart(process, (err) => {
                resolve(err ? err : true)
            })
        })
    }

}

module.exports = PM2;