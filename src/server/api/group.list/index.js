const fs = require("fs")
const path = require("path")

module.exports = async ({body, query}) => {
    let groups = fs.readdirSync(path.join(ProjectRoot, 'raw/group'));
    if (groups.length) {
        return {
            code: 0,
            groups: groups
        }
    }
    return {
        code: 0,
        groups: []
    }
}