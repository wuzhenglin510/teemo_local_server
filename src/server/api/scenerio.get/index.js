const fs = require("fs")
const path = require("path")

module.exports = async ({body, query}) => {
    let realPath = path.join(ProjectRoot, 'raw/scenerio', body.scenerioName);
    return JSON.parse(fs.readFileSync(realPath).toString())
}

