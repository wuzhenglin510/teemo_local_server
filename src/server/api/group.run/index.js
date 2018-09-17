const fs = require("fs")
const path = require("path")
const shell = require("shelljs")
const build = require('../../core/build')

module.exports = async ({body, query}) => {
    let realPath = path.join(ProjectRoot, 'raw/group', body.scenerioName);
    //编译
    fs.writeFileSync(path.join(__dirname, "../../core/env"), JSON.stringify({
        root: `${ProjectRoot}/build`,
        type: 'group'
    }))
    let compiled = build(realPath, path.join(ProjectRoot, 'build/group', `${body.scenerioName}.js`))
    console.log(`mocha ${path.join(__dirname, '../../core/run.js')}`)
    shell.exec(`mocha ${path.join(__dirname, '../../core/run.js')}`)
    return {
        code: 0
    }
}

