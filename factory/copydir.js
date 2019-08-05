var path = require('path')
var fs = require('fs')

class Directory {
    // constructor(dir) {
    //     this.dir = dir
    // }
    mkdir(dir) {
        // making directory without exception if exists
        try {
            fs.mkdirSync(dir);
            // fs.mkdirSync(dir, 0755);
        } catch (e) {
            if (e.code != "EEXIST") {
                throw e;
            }
        }
    }
    rmdir(dir) {
        if (fs.existsSync(dir)) {
            var list = fs.readdirSync(dir);
            for (var i = 0; i < list.length; i++) {
                var filename = path.join(dir, list[i]);
                var stat = fs.statSync(filename);
    
                if (filename == "." || filename == "..") {
                    // pass these files
                } else if (stat.isDirectory()) {
                    // rmdir recursively
                    this.rmdir(filename);
                } else {
                    // rm fiilename
                    fs.unlinkSync(filename);
                }
            }
            fs.rmdirSync(dir);
        } else {
            console.warn("warn: " + dir + " not exists");
        }
    }
    async copyDir(src, dest) {
        // dest = `${dest}\\${src.split('\\')[src.split('\\').length-1]}`
        this.mkdir(dest);
        var files = fs.readdirSync(src);
        for (var i = 0; i < files.length; i++) {
            if (files[i] == 'node_modules') {
                continue;
            }
            var current = fs.lstatSync(path.join(src, files[i]));
            if (current.isDirectory()) {
                this.copyDir(path.join(src, files[i]), path.join(dest, files[i]));
            } else if (current.isSymbolicLink()) {
                var symlink = fs.readlinkSync(path.join(src, files[i]));
                fs.symlinkSync(symlink, path.join(dest, files[i]));
            } else {
                this.copy(path.join(src, files[i]), path.join(dest, files[i]));
            }
        }
    }
    copy(src, dest) {
        var bufferFile = fs.readFileSync(src, { encoding: 'utf8', flag: 'r' })
        fs.writeFileSync(dest, bufferFile)
    }
    
}
module.exports = Directory