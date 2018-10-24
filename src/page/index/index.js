const fs = require('fs')
const startServer = require('../../server')
const shell = require('shelljs')
shell.config.execPath = shell.which('node').toString()
const path = require('path')
const os = require('os')
const child_process = require("child_process")
const rp = require("request-promise")

const VERSION = 0;

let status = false;
let directory = '';

async function checkUpdate() {
    let body = JSON.parse(await rp("https://www.wuzhenglin.com/teemo/teemo_update.json"));
    if (VERSION < body.version) {
        alert(`${body.desc}\n当前版本号: ${VERSION}\n最新版本号: ${body.version}`);
        child_process.exec(`start ${body.url}`);
    }
}

checkUpdate()


function toStart() {
    if (status == true) {
        alert('already started');
        return;
    }
    directory = document.getElementById('in_dir').value;
    if (_checkDirExist(directory)) {
        global.ProjectRoot = directory;
        prepareTestEnv();
        document.getElementById('starting_status').className = '';
        document.getElementById('offline_status').className = 'my-hide';
        startServer().then((msg) => {
            status = true;
            document.getElementById('online_animation').className = '';
            document.getElementById('starting_status').className = 'my-hide';
            document.getElementById('online_status').className = '';
        }).catch(err => {
            document.getElementById('starting_status').className = 'my-hide';
            document.getElementById('offline_status').className = '';
            alert(err)
        })
    } else {
        alert('filepath is not exist or a directory');
    }
}



function prepareTestEnv() {
    shell.mkdir('-p', path.join(ProjectRoot, 'raw/group'), path.join(ProjectRoot, 'raw/scenerio'));
        shell.mkdir('-p', path.join(ProjectRoot, 'build/group'), path.join(ProjectRoot, 'build/scenerio'));
        shell.cd(path.join(ProjectRoot, 'build'));
        shell.cp('-n', path.join(__dirname, '../../server/core/test_env/run.js'), path.join(ProjectRoot, 'build'));
        shell.cp('-n', path.join(__dirname, '../../server/core/test_env/customGlobalFunc.js'), path.join(ProjectRoot, 'build'))
        shell.cp(path.join(__dirname, '../../server/core/test_env/selenium-server-standalone-3.9.1.jar'), path.join(ProjectRoot, 'build'))
        if (os.platform().indexOf("darwin") != -1) {
            child_process.exec(`osascript -e 'tell application "Terminal" to do script "cd ${path.join(ProjectRoot, 'build')} && npm install selenium-webdriver"'`)
            child_process.exec(`osascript -e 'tell application "Terminal" to do script "cd ${path.join(ProjectRoot, 'build')} && java -jar selenium-server-standalone-3.9.1.jar"'`)
        } else if(os.platform().indexOf("win") != -1) {
            shell.cp('-n', path.join(__dirname, '../../server/core/test_env/win/360_location.json'), path.join(ProjectRoot, 'build'));
            child_process.exec(`start cmd.exe @cmd /k "cd ${path.join(ProjectRoot, 'build')} & npm install selenium-webdriver"`)
            child_process.exec(`start cmd.exe @cmd /k "cd ${path.join(ProjectRoot, 'build')} & java -jar selenium-server-standalone-3.9.1.jar"`)
        }
}


function _checkDirExist(directory) {
    try {
        let stat = fs.statSync(directory);
        return stat.isDirectory();
    } catch (err) {
        return false;
    }
}