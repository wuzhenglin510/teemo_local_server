const fs = require('fs')
const startServer = require('../../server')
const shell = require('shelljs')
const path = require('path')

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