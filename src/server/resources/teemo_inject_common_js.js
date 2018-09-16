var teemoFeather = null;
var teemoScenerioData = {
    scenerioName: null,
    before: null,
    steps: [
        {
            action: 'go',
            url: document.URL
        }
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
        teemoInjectListenerInEveryNode(currentNode.childNodes);
        currentNode.addEventListener('click', teemoTraceOnclickHandler, false);
        if (currentNode.nodeName.toUpperCase() == "INPUT") {
            if (currentNode.type.toLowerCase() != "radio" && currentNode.type.toLowerCase() != "checkbox") {
                currentNode.addEventListener('change', teemoTraceInputHandler, false);
            }
        }
    })
}


function teemoRemoveStep(idx) {
    if (idx == 0) {
        teemoScenerioData.steps.shift();
    } else {
        teemoScenerioData.steps = teemoScenerioData.steps.splice(idx, 1);
    }
    rebuildStepCards()
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
            <div id='stepCard_${idx}' class="teemo-one-container-close" onclick="teemoRemoveStep(${idx})">X</div>
            <div> 
                <div>action: ${step.action}</div><br/>
                <span>xpath:</span><input class="teemo-step-card-value" type="text" value="${step.xpath}"  disabled=true /><br/><br/>
                <span>tips: </span><input class="teemo-step-card-tips" type="text" value="" />
            </div>
        `
        } else if(step.action == 'input') {
            stepCard.innerHTML = `
            <div id='stepCard_${idx}' class="teemo-one-container-close" onclick="teemoRemoveStep(${idx})">X</div>
            <div> 
                <div>action: ${step.action}</div><br/>
                <span>value:</span><input class="teemo-step-card-value" type="text" value="${step.value}"  disabled=true /><br/><br/>
                <span>tips: </span><input class="teemo-step-card-tips" type="text" value="" />
            </div>
        `
        } else if (step.action == 'go') {
            stepCard.innerHTML = `
            <div id='stepCard_${idx}' class="teemo-one-container-close" onclick="teemoRemoveStep(${idx})">X</div>
            <div> 
                <div>action: ${step.action}</div><br/>
                <span>url:  </span><input class="teemo-step-card-value" type="text" value="${step.url}"  disabled=true /><br/><br/>
                <span>tips: </span><input class="teemo-step-card-tips" type="text" value="" />
            </div>
        `
        }
        
        container.appendChild(stepCard);
    }
}












