var teemoFeather = null;
var teemoScenerioData = {
    scenerioName: null,
    before: null,
    steps: [

    ]
}

function teemoCreatePrepare() {
    var prepare = document.createElement("DIV");
    prepare.id = 'teemo-waiting-finish';
    prepare.className = "teemo-waiting-finish teemo-hide";
    prepare.innerHTML = `<h1 class="teemo-prepare">渲染中，请稍等</h1>`;
    document.body.appendChild(prepare);
}


function teemoTraceOnclickHandler(element) {
    element.stopPropagation();
    teemoScenerioData.steps.push({
        action: 'click',
        xpath: teemoGetElementXPath(element.toElement)
    })
    console.log(teemoScenerioData)
    rebuildStepCards();
}

function teemoTraceInputHandler(element) {
    element.stopPropagation();
    teemoScenerioData.steps.push({
        action: 'input',
        value: element.target.value
    })
    console.log(teemoScenerioData)
    rebuildStepCards();
}

function teemoPost(uri, data) {
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", uri, true);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                let result = JSON.parse(xhr.responseText);
                resolve(result);
            }
        }
        xhr.send(JSON.stringify(data));
    })
}

function teemoInjectListenerInEveryNode(nextRoots) {
    if (nextRoots.length == 0) return;
    nextRoots.forEach(currentNode => {
        currentNode.addEventListener('click', teemoTraceOnclickHandler, false);
        teemoInjectListenerInEveryNode(currentNode.childNodes);
        if (currentNode.nodeName.toUpperCase() == "INPUT") {
            currentNode.addEventListener('change', teemoTraceInputHandler, false);
        }
    })
}

function rebuildStepCards() {
    let container = document.getElementById('teemo-injectedBox');
    container.innerHTML = '';
    for (let idx = 0; idx < teemoScenerioData.steps.length; idx++) {
        let step = teemoScenerioData.steps[idx];
        let stepCard = document.createElement('div');
        stepCard.className = "teemo-one-step-container";
        if (step.action == 'click') {
            stepCard.innerHTML = `
            <div id='stepCard_${idx}' class="teemo-one-container-close">X</div>
            <div> 
                <div>action: ${step.action}</div><br/>
                <span>xpath:</span><input style="width: 65%;margin-left: 10px;" type="text" value="${step.xpath}"  disable />
            </div>
        `
        } else if(step.action == 'input') {
            stepCard.innerHTML = `
            <div id='stepCard_${idx}' class="teemo-one-container-close">X</div>
            <div> 
                <div>action: ${step.action}</div>
                <span>value:</span><input style="width: 65%;margin-left: 10px;" type="text" value="${step.value}"  disable />
            </div>
        `
        }
        
        container.appendChild(stepCard);
    }
}












