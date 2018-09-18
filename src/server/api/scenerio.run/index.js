const fs = require("fs")
const path = require("path")
const shell = require("shelljs")
const build = require('../../core/build')
const child_process = require("child_process")
const os = require('os')


module.exports = async ({body, query}) => {
    let realPath = path.join(ProjectRoot, 'raw/scenerio', body.scenerioName);
    //编译
    fs.writeFileSync(path.join(ProjectRoot, "build/env"), JSON.stringify({
        root: `${ProjectRoot}/build`,
        type: 'scenerio'
    }), {encoding:'utf8',flag:'w'})
    let compiled = build(realPath, path.join(ProjectRoot, 'build/scenerio', `${body.scenerioName}.js`))
    if (os.platform().indexOf("darwin") != -1) {

    } else if(os.platform().indexOf("win") != -1) {
        child_process.exec(`start cmd.exe @cmd /k "cd ${path.join(ProjectRoot, 'build')} & mocha run.js ${body.scenerioName ? '' : '-b'} ${body.scenerioName ? " -g " + body.scenerioName : ''}"`)
    }
    return {
        code: 0
    }
}

