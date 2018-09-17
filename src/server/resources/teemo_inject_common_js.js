var teemoFeather = null;
var teemoScenerioData = {
    scenerioName: null,
    before: null,
    steps: [
        {
            action: 'go',
            url: document.URL,
            tips: ''
        }
    ]
}
var lastEventTriggerTime = {
    input: new Date().getTime(),
    click: new Date().getTime()
};

function shouldIgnoreThisEvent(last) {
    let now = new Date().getTime();
    return (now - last) < 200;
}


function teemoCreatePrepare() {
    var prepare = document.createElement("DIV");
    prepare.id = 'teemo-waiting-finish';
    prepare.className = "teemo teemo-waiting-finish teemo-hide";
    prepare.innerHTML = `<h1 class="teemo teemo-prepare">渲染中，请稍等</h1>`;
    document.body.appendChild(prepare);
}


function teemoTraceOnclickHandler(element) {
    // element.stopPropagation();
    if (shouldIgnoreThisEvent(lastEventTriggerTime.click)) {
        return;
    }
    lastEventTriggerTime.click = new Date().getTime()
    teemoScenerioData.steps.push({
        action: 'click',
        xpath: teemoGetElementXPath(element.toElement),
        tips: ''
    })
    rebuildStepCards();
}

function teemoTraceInputHandler(element) {
    // element.stopPropagation();
    if (shouldIgnoreThisEvent(lastEventTriggerTime.input)) {
        return;
    }
    lastEventTriggerTime.input = new Date().getTime()
    teemoScenerioData.steps.push({
        action: 'input',
        value: element.target.value,
        tips: ''
    })
    rebuildStepCards();
}


function modifyTips(idx, event) {
    teemoScenerioData.steps[idx].tips = event.target.value;
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
        if (currentNode.className && currentNode.className.indexOf && currentNode.className.indexOf("teemo") != -1) {
            console.log('teemo component needless registy listener')
            return;
        } 
        teemoInjectListenerInEveryNode(currentNode.childNodes);
        currentNode.addEventListener('click', teemoTraceOnclickHandler, true);
        if (currentNode.nodeName.toUpperCase() == "INPUT") {
            if (currentNode.type.toLowerCase() != "radio" && currentNode.type.toLowerCase() != "checkbox") {
                currentNode.addEventListener('change', teemoTraceInputHandler, true);
            }
        }
    })
}



function teemoRemoveStep(idx) {
    if (idx == 0) {
        teemoScenerioData.steps.shift();
    } else {
        teemoScenerioData.steps.splice(idx, 1);
    }
    rebuildStepCards()
}

function rebuildStepCards() {
    let container = document.getElementById('teemo-injectedBox');
    container.innerHTML = '';
    for (let idx = 0; idx < teemoScenerioData.steps.length; idx++) {
        let step = teemoScenerioData.steps[idx];
        let stepCard = document.createElement('div');
        stepCard.className = "teemo teemo-one-step-container";
        if (step.action == 'click') {
            stepCard.innerHTML = `
            <div id='stepCard_${idx}' class=" teemo teemo-one-container-close" onclick="teemoRemoveStep(${idx})"    >X</div>
            <div class=" teemo " > 
                <div   class=" teemo " >action: ${step.action}</div><br/>
                <span class=" teemo " >xpath:</span><input class="teemo teemo-step-card-value" type="text" value="${step.xpath}"  disabled=true   /><br/><br/>
                <span class=" teemo " >tips: </span><input onchange='modifyTips(${idx}, event)'  class="teemo teemo-step-card-tips" type="text" value="${step.tips}" />
            </div>
        `
        } else if(step.action == 'input') {
            stepCard.innerHTML = `
            <div id='stepCard_${idx}' class="teemo teemo-one-container-close" onclick="teemoRemoveStep(${idx})"  >X</div>
            <div  class=" teemo "  > 
                <div  class=" teemo "  >action: ${step.action}</div><br/>
                <span  class=" teemo "  >value:</span><input   class="teemo teemo-step-card-value" type="text" value="${step.value}"  disabled=true /><br/><br/>
                <span  class=" teemo " >tips: </span><input onchange='modifyTips(${idx}, event)'   class="teemo teemo-step-card-tips" type="text" value="${step.tips}" />
            </div>
        `
        } else if (step.action == 'go') {
            stepCard.innerHTML = `
            <div  id='stepCard_${idx}' class="teemo teemo-one-container-close" onclick="teemoRemoveStep(${idx})">X</div>
            <div  class=" teemo "  > 
                <div  class=" teemo "  >action: ${step.action}</div><br/>
                <span  class=" teemo "  >url:  </span><input   class="teemo teemo-step-card-value" type="text" value="${step.url}"  disabled=true /><br/><br/>
                <span   class=" teemo " >tips: </span><input onchange='modifyTips(${idx}, event)'   class="teemo teemo-step-card-tips" type="text" value="${step.tips}" />
            </div>
        `
        }
        
        container.appendChild(stepCard);
    }
}


var teemoObserveRootNode = document.body;
var teemoObserveConfig = {childList: true, subtree: true };
function teemoObserveEventHandler (mutationsList) {
    for(let mutation of mutationsList) {
        if (mutation.target.className.indexOf("teemo") == -1) {
            console.log(mutation)
            teemoInjectListenerInEveryNode(mutation.addedNodes)
        } else {
            console.log("teemo dom needless registy listener")
        }
    }
};

var teemoObserver = new MutationObserver(teemoObserveEventHandler);
teemoObserver.observe(teemoObserveRootNode, teemoObserveConfig);









