const fs = require("fs")
const path = require("path")

module.exports = async ({body, query}) => {
    let scenerio = [];
    let scenerioFiles = fs.readdirSync(path.join(ProjectRoot, 'raw/scenerio'));
    if (scenerioFiles.length == 0) {
        return {
            code: 0,
            scenerios: []
        }
    } else {
        for (let filename of scenerioFiles) {
            let json = fs.readFileSync(path.join(ProjectRoot, 'raw/scenerio', filename))
            scenerio.push(JSON.parse(json));
        }
        return {
            code: 0,
            scenerios: scenerio
        }
    }
}