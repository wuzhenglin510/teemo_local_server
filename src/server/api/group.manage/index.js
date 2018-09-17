const fs = require("fs")
const path = require("path")

module.exports = async ({body, query}) => {
    let groups = [];
    let groupFiles = fs.readdirSync(path.join(ProjectRoot, 'raw/group'));
    if (groupFiles.length == 0) {
        return {
            code: 0,
            groups: []
        }
    } else {
        for (let filename of groupFiles) {
            let json = fs.readFileSync(path.join(ProjectRoot, 'raw/group', filename))
            groups.push(JSON.parse(json));
        }
        return {
            code: 0,
            groups: groups
        }
    }
}