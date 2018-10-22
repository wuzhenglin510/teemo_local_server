const fs = require("fs")
const path = require("path")
const shell = require("shelljs")
const build = require('../../core/build')
const child_process = require("child_process")
const os = require('os')



module.exports = async ({body, query}) => {
    //初始化环境
    fs.writeFileSync(path.join(ProjectRoot, "build/env"), JSON.stringify({
        browser: body.browser,
        root: `${ProjectRoot}/build`,
        type: 'group'
    }), {encoding:'utf8',flag:'w'})
    if (os.platform().indexOf("darwin") != -1) {
        shell.rm(`${path.join(ProjectRoot, 'build', 'chromedriver')}`)
        shell.rm(`${path.join(ProjectRoot, 'build', 'geckodriver')}`)
        if (body.browser == "Chrome") {
            shell.cp(path.join(__dirname, '../../core/test_env/mac/chromedriver'), path.join(ProjectRoot, 'build', 'chromedriver'));
        } else if (body.browser == "Firefox") {
            shell.cp(path.join(__dirname, '../../core/test_env/mac/geckodriver'), path.join(ProjectRoot, 'build', 'geckodriver')); 
        }
    } else if(os.platform().indexOf("win") != -1) {
        switch(body.browser) {
            case 'Chrome': {
                shell.exec("taskkill /f /t /im chromedriver.exe")
                shell.rm(`${path.join(ProjectRoot, 'build', 'chromedriver.exe')}`)
                shell.cp(path.join(__dirname, '../../core/test_env/win/chromedriver.exe'), path.join(ProjectRoot, 'build', 'chromedriver.exe')); break;
            } 
            case 'Firefox': {
                shell.exec("taskkill /f /t /im geckodriver.exe")
                shell.rm(`${path.join(ProjectRoot, 'build', 'geckodriver.exe')}`)
                shell.cp(path.join(__dirname, '../../core/test_env/win/geckodriver.exe'), path.join(ProjectRoot, 'build', 'geckodriver.exe')); break;
            } 
            case '360': {
                shell.cp(path.join(__dirname, '../../core/test_env/win/360.exe'), path.join(ProjectRoot, 'build', 'chromedriver.exe')); break;
            } 
            case 'Edge': {
                shell.exec("taskkill /f /t /im MicrosoftWebDriver.exe")
                shell.rm(`${path.join(ProjectRoot, 'build', 'MicrosoftWebDriver.exe')}`)
                shell.cp(path.join(__dirname, '../../core/test_env/win/MicrosoftWebDriver.exe'), path.join(ProjectRoot, 'build', 'MicrosoftWebDriver.exe')); break;
            }
            case 'IE': {
                shell.exec("taskkill /f /t /im IEDriverServer.exe")
                shell.rm(`${path.join(ProjectRoot, 'build', 'IEDriverServer.exe')}`)
                shell.cp(path.join(__dirname, '../../core/test_env/win/IEDriverServer.exe'), path.join(ProjectRoot, 'build', 'IEDriverServer.exe')); break;
            }
            default: return {
                code: 4
            }
        }
    }

    if (!body.runAll) {
        let realPath = path.join(ProjectRoot, 'raw/group', body.scenerioName);
        let compiled = build(realPath, path.join(ProjectRoot, 'build/group', `${body.scenerioName}.js`));
        if (os.platform().indexOf("darwin") != -1) {
            child_process.exec(`osascript -e 'tell application "Terminal" to do script "cd ${path.join(ProjectRoot, 'build')} && mocha run.js  -g ${body.scenerioName}"'`)
        } else if(os.platform().indexOf("win") != -1) {
            child_process.exec(`start cmd.exe @cmd /k "cd ${path.join(ProjectRoot, 'build')} & mocha run.js  -g ${body.scenerioName}"`)
        }
    } else {
        let groupFiles = fs.readdirSync(path.join(ProjectRoot, 'raw/group'));
        groupFiles.forEach(filename => {
            let realPath = path.join(ProjectRoot, 'raw/group', filename);
            let compiled = build(realPath, path.join(ProjectRoot, 'build/group', `${filename}.js`));
        });
        if (os.platform().indexOf("darwin") != -1) {
            child_process.exec(`osascript -e 'tell application "Terminal" to do script "cd ${path.join(ProjectRoot, 'build')} && mocha run.js ${body.silence ? '' : '-b'} -g \"${body.scenerioName}\" "'`)
        } else if(os.platform().indexOf("win") != -1) {
            child_process.exec(`start cmd.exe @cmd /k "cd ${path.join(ProjectRoot, 'build')} & mocha run.js ${body.silence ? '' : '-b'} -g \"${body.scenerioName}\" "`)
        }
    }  
    return {
        code: 0
    }
}

