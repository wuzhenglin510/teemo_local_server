const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');
require("./customGlobalFunc.js")

describe('test', function() {
    testBefore();
    TestCases.forEach(caseFile => {
        require(caseFile);
    })

    after(function () {
        console.log('test case run finish, start clean process');
        clean();
        console.log('clean process finished');
    })
    
});

function clean() {
    switch(env.browser) {
        case 'Chrome': {
            if (os.platform().indexOf("win") != -1) {
                child_process.exec(`taskkill /f /t /im chromedriver.exe`)
            } else if (os.platform().indexOf("darwin") != -1) {

            }
        }
        case 'Firefox': {
            if (os.platform().indexOf("win") != -1) {
                child_process.exec(`taskkill /f /t /im geckodriver.exe`)
            } else if (os.platform().indexOf("darwin") != -1) {

            }
        }
        case '360': {
            if (os.platform().indexOf("win") != -1) {
                child_process.exec(`taskkill /f /t /im chromedriver.exe`)
            } else if (os.platform().indexOf("darwin") != -1) {

            }
        }
        case 'Edge': {
            if (os.platform().indexOf("win") != -1) {
                child_process.exec(`taskkill /f /t /im MicrosoftWebDriver.exe`)
            } else if (os.platform().indexOf("darwin") != -1) {

            }
        }
        case 'IE': {
            if (os.platform().indexOf("win") != -1) {
                child_process.exec(`taskkill /f /t /im IEDriverServer.exe`)
            } else if (os.platform().indexOf("darwin") != -1) {

            }
        }
        case 'Safari': {
            
        }
    }
}

function testBefore() {
    global.env = JSON.parse(fs.readFileSync(path.join(__dirname, "env")).toString());
    if (env.browser == "360") {
        global.b360Location = JSON.parse(fs.readFileSync(path.join(__dirname, "360_location.json")).toString()).location;
    }
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