const fs = require("fs")
const path = require("path")

module.exports = async ({body, query}) => {
    if (body.scenerioName && body.steps.length > 0) {
        fs.writeFileSync(path.join(ProjectRoot, 'raw/group', `${body.scenerioName}`), JSON.stringify(body, null , 4), {encoding:'utf8',flag:'w'});
        return {
            code: 0
        }
    }
    return {
        code: 2
    }
}