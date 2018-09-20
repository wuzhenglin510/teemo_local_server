const fs = require('fs');
const path = require('path');
const {Builder} = require('selenium-webdriver');
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
    global.Driver = new Builder().forBrowser('chrome').setChromeOptions("").usingServer('http://localhost:4444/wd/hub').build();
    Driver.manage().window().maximize();
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