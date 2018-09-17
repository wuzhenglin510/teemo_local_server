function teemoCreateScenerioToolbar() {
    var injectedHTML = document.createElement("DIV");
    injectedHTML.id = 'teemoContainer';
    injectedHTML.className = "teemo teemo-env";
    injectedHTML["data-teemoIdentity"] = true;
    injectedHTML.innerHTML = 
`
<div id="teemo-dragBox" class="teemo teemo-drag-box teemo-box"  >
  <div id="teemo-dragBoxBar" class="teemo teemo-no-select" >
        <div class="teemo teemo-my-drag-span"  >TEEMO</div>
  </div>
  <div id="teemo-close" class="teemo teemo-close">X</div>
  <div class="teemo teemo-input-div">
        <input id="teemo-scenerio-name" class="teemo teemo-input" type="text" placeholder="Input Scenerio Name" style="background: #a3d1ff;" />
  </div>
  <div class="teemo teemo-seperator-line"  ></div>
  <div class="teemo teemo-steps-container"  >
        group: 
        <select id="teemo-group" class="teemo teemo-group">
            
            <option value ="volvo">登录小红十</option>
            <option value ="saab">登录小红十登录小红十</option>
            <option value="opel">登录小红十登录小红十登录小红十</option>
            <option value="audi">登录小红十登录小红十登录小红十登录小红十</option>
        </select>
  <div>
  <div class="teemo teemo-seperator-line"  ></div>
  <div class="teemo teemo-steps-container"  >
        steps
        <button id="teemo-save" class="teemo teemo-sava" onclick="createScenerio()">save</button>
  <div>
  <div class="teemo teemo-seperator-line"  ></div>
  <div id="teemo-injectedBox" class="teemo" >



  </div>
</div>
`;

    document.body.appendChild(injectedHTML);

    var isMouseDown,
        initX,
        initY,
        teemoDragBox = document.getElementById('teemo-dragBox');
        teemoInjectedBox = document.getElementById('teemo-injectedBox');
        height = teemoInjectedBox.offsetHeight,
        width = teemoInjectedBox.offsetWidth,
        teemoDragBoxBar = document.getElementById('teemo-dragBoxBar');


        teemoDragBoxBar.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        document.body.classList.add('teemo-no-select');
        teemoInjectedBox.classList.add('teemo-pointer-events');
        initX = e.offsetX;
        initY = e.offsetY;
        teemoDragBox.style.opacity = 0.5;
    })

    teemoDragBoxBar.addEventListener('mouseup', function(e) {
        mouseupHandler();
    })

    document.getElementById("teemo-scenerio-name").addEventListener('change', function(e) {
        teemoScenerioData.scenerioName = e.target.value;
    })

    document.addEventListener('mousemove', function(e) {
        if (isMouseDown) {
            var cx = e.clientX - initX,
                cy = e.clientY - initY;
            if (cx < 0) {
                cx = 0;
            }
            if (cy < 0) {
                cy = 0;
            }
            if (window.innerWidth - e.clientX + initX < width + 16) {
                cx = window.innerWidth - width;
            }
            if (e.clientY > window.innerHeight - height - teemoDragBoxBar.offsetHeight + initY) {
                cy = window.innerHeight - teemoDragBoxBar.offsetHeight - height;
            }
            teemoDragBox.style.left = cx + 'px';
            teemoDragBox.style.top = cy + 'px';
        }
    })


    document.addEventListener('mouseup', function(e) {
        if (e.clientY > window.innerWidth || e.clientY < 0 || e.clientX < 0 || e.clientX > window.innerHeight) {
            mouseupHandler();
        }
    });

    function mouseupHandler() {
        isMouseDown = false;
        document.body.classList.remove('teemo-no-select');
        teemoInjectedBox.classList.remove('teemo-pointer-events');
        teemoDragBox.style.opacity = 1;
    }

    document.getElementById('teemo-close').onclick = function (element) {
        document.getElementById("teemoContainer").remove();
    }
}


function createScenerio() {
    console.log(teemoScenerioData)
    teemoPost('http://localhost:6385/scenerio.create', teemoScenerioData).then(result => {
        switch(result.code) {
            case 0: {
                alert('save successfully');
                window.location.reload();
                break;
            }
            case 1: {
                alert('sceneria name exist');
                break;
            }
            case 2: {
                alert('required data missing');
                break;
            }
        }
    })
}

function listGroup() {
    teemoPost('http://localhost:6385/group.list', teemoScenerioData).then(result => {
        let html = '<option value="" selected="selected" class="teemo">without before group</option>';
        for(let group of result.groups) {
            html = html.concat(`<option  class="teemo" value="${group}">${group}</option>`)
        }
        document.getElementById('teemo-group').innerHTML = html;
    })
}


function teemoStart() {
    teemoFeather = 'scenerio';
    teemoCreatePrepare()
    document.getElementById('teemo-waiting-finish').className = "teemo teemo-waiting-finish";
    teemoInjectListenerInEveryNode(document.body.childNodes, document.body);
    setTimeout(() => {
        document.getElementById('teemo-waiting-finish').className = "teemo teemo-hide" ;
    }, 1000)
    teemoCreateScenerioToolbar();
    listGroup();
    rebuildStepCards();
}

while(true) {
    if (document.readyState == "complete") {
        console.log("All resources finished loading!");
        teemoStart();
        break;
    }
}




