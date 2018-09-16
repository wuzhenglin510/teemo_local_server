function teemoCreateGroupToolbar() {
    var injectedHTML = document.createElement("DIV");
    injectedHTML.id = 'teemoContainer';
    injectedHTML.className = "teemo-env";
    injectedHTML.innerHTML = 
`
<div id="teemo-dragBox" class="teemo-drag-box teemo-box">
  <div id="teemo-dragBoxBar" class="teemo-no-select">
        <div class="teemo-my-drag-span">TEEMO</div>
        <div id="teemo-close" class="teemo-close">X</div>
  </div>
  <div class="teemo-input-div">
        <input id="teemo-group-name" class="teemo-input" type="text" placeholder="Input Step Group Name" style="background: #a3d1ff;" />
  </div>
  <div class="teemo-seperator-line"></div>
  <div class="teemo-steps-container">
        steps
  <div>
  <div class="teemo-seperator-line"></div>
  <div id="teemo-injectedBox">



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

    document.getElementById("teemo-group-name").addEventListener('change', function(e) {
        teemoScenerioData.scenerioName = e.target.value;
        console.log(`set scenerio name : ${teemoScenerioData.scenerioName}`);
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



function teemoStart() {
    teemoFeather = 'group';
    teemoCreatePrepare()
    document.getElementById('teemo-waiting-finish').className = "teemo-waiting-finish";
    teemoInjectListenerInEveryNode(document.body.childNodes, document.body);
    setTimeout(() => {
        document.getElementById('teemo-waiting-finish').className = "teemo-hide" ;
    }, 1000)
    teemoCreateGroupToolbar();
    rebuildStepCards();
}

teemoStart()