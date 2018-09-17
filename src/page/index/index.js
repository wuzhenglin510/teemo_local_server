const fs = require('fs')
const startServer = require('../../server')
const shell = require('shelljs')
shell.config.execPath = shell.which('node').toString()
const path = require('path')
const os = require('os')
const child_process = require("child_process")

let status = false;
let directory = '';

function toStart() {
    if (status == true) {
        alert('already started');
        return;
    }
    directory = document.getElementById('in_dir').value;
    if (_checkDirExist(directory)) {
        global.ProjectRoot = directory;
        shell.mkdir('-p', path.join(ProjectRoot, 'raw/group'), path.join(ProjectRoot, 'raw/scenerio'));
        shell.mkdir('-p', path.join(ProjectRoot, 'build/group'), path.join(ProjectRoot, 'build/scenerio'));
        shell.cd(path.join(ProjectRoot, 'build'));
        if (os.platform().indexOf("darwin") != -1) {
            shell.cp(path.join(__dirname, '../../server/core/test_env/mac/chromedriver'), path.join(ProjectRoot, 'build'))
            let npmShell = child_process.spawnSync('/Applications/Utilities/Terminal.app/Contents/MacOS/Terminal', [], {
                input: `cd ${path.join(ProjectRoot, 'build')}`
            });
            
            // npmShell.stdin.write(`cd ${path.join(ProjectRoot, 'build')}\n`);
            // npmShell.stdin.write(`npm install selenium-webdriver\n`);
            // npmShell.on('data', function(data){
            //     console.log('data from grep: ' + data);
            // });
            // npmShell.stdin.end()
            
        } else if(os.platform().indexOf("win") != -1) {
            shell.cp(path.join(__dirname, '../../server/core/test_env/win/chromedriver.exe'), path.join(ProjectRoot, 'build'))
        }
        shell.cp(path.join(__dirname, '../../server/core/test_env/run.js'), path.join(ProjectRoot, 'build'))
        shell.cp(path.join(__dirname, '../../server/core/test_env/geckodriver.exe'), path.join(ProjectRoot, 'build'))
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


function _checkDirExist(directory) {
    try {
        let stat = fs.statSync(directory);
        return stat.isDirectory();
    } catch (err) {
        return false;
    }
}