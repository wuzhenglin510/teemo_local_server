const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const translate = require('./translate')

module.exports = function (filePath, saveRealPath) {
    let template = ejs.compile(fs.readFileSync(path.join(__dirname, 'scenerio_template.ejs')).toString());
    let str = template(translate(JSON.parse(fs.readFileSync(filePath).toString())));
    fs.writeFileSync(saveRealPath, str);
    return str;
}
