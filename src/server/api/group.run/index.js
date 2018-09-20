const fs = require("fs")
const path = require("path")
const shell = require("shelljs")
const build = require('../../core/build')
const child_process = require("child_process")
const os = require('os')


module.exports = async ({body, query}) => {
    //初始化环境
    fs.writeFileSync(path.join(ProjectRoot, "build/env"), JSON.stringify({
        root: `${ProjectRoot}/build`,
        type: 'group'
    }), {encoding:'utf8',flag:'w'})
    if (!body.runAll) {
        let realPath = path.join(ProjectRoot, 'raw/group', body.scenerioName);
        let compiled = build(realPath, path.join(ProjectRoot, 'build/group', `${body.scenerioName}.js`));
        if (os.platform().indexOf("darwin") != -1) {

        } else if(os.platform().indexOf("win") != -1) {
            child_process.exec(`start cmd.exe @cmd /k "cd ${path.join(ProjectRoot, 'build')} & mocha run.js  -g ${body.scenerioName}"`)
        }
    } else {
        let groupFiles = fs.readdirSync(path.join(ProjectRoot, 'raw/group'));
        groupFiles.forEach(filename => {
            let realPath = path.join(ProjectRoot, 'raw/group', filename);
            let compiled = build(realPath, path.join(ProjectRoot, 'build/group', `${filename}.js`));
        });
        if (os.platform().indexOf("darwin") != -1) {

        } else if(os.platform().indexOf("win") != -1) {
            child_process.exec(`start cmd.exe @cmd /k "cd ${path.join(ProjectRoot, 'build')} & mocha run.js ${body.silence ? '' : '-b'} -g \"${body.scenerioName}\" "`)
        }
    }  
    return {
        code: 0
    }
}

