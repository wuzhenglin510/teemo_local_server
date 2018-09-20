const fs = require('fs');
const path = require('path');
require("./customGlobalFunc.js")

describe('test', function() {
    testBefore();
    TestCases.forEach(caseFile => {
        require(caseFile);
    })
});


function testBefore() {
    let env = JSON.parse(fs.readFileSync(path.join(__dirname, "env")).toString());
    global.TestCases = [];
    findTestCase(path.join(env.root, env.type));
}

function findTestCase(root) {
    fs.readdirSync(root).forEach(filename =>{
        let state = fs.lstatSync(path.join(root, filename));
        if (state.isDirectory()) {
        findTestCase(path.join(root, filename));
        } else {
            TestCases.push(path.join(root, filename));
        }
    })
}