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
var originAmount = 0;
var appendedAmount = 0;
var lastEventTriggerTime = {
    input: new Date().getTime() + 3000,
    click: new Date().getTime() + 3000
};
var lastClickXpath = '';

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
    let cxpath = teemoGetElementXPath(element.toElement);
    let bb = cxpath.split('/');
    console.log(`cxpath: ${cxpath}`)
    if (bb[3].indexOf('[') != -1) {
        let pat = /(.*\[)(\d+)(\].*)/;
        let mbb = bb[3].match(pat)
        let idx = parseInt(mbb[2])
        console.log(`idx: ${idx}`)
        console.log(`appendedAmount: ${appendedAmount}`)
        console.log(`originAmount: ${originAmount}`)
        if (idx >= (appendedAmount)) idx = (idx - parseInt(appendedAmount) + parseInt(originAmount))
        bb[3] = `${mbb[1]}${idx}${mbb[3]}`
        console.log(`idx: ${idx}`)
        cxpath = bb.join('/')
    }
    if (cxpath == lastClickXpath) return;
    lastClickXpath = cxpath;
    lastEventTriggerTime.click = new Date().getTime()
    teemoScenerioData.steps.push({
        action: 'click',
        xpath: cxpath,
        tips: ''
    })
    rebuildStepCards();
}

function setOriginNodeAmount(event) {
    originAmount = parseInt(event.target.value);
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

function modifyUrl(idx, event) {
    teemoScenerioData.steps[idx].url = event.target.value;
}

function modifyTime(idx, event) {
    teemoScenerioData.steps[idx].time = event.target.value;
}

function modifyValue(idx, event) {
    teemoScenerioData.steps[idx].value = event.target.value;
}

function modifyXpath(idx, event) {
    teemoScenerioData.steps[idx].xpath = event.target.value;
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
        if (currentNode.nodeName.toUpperCase() == "TEXTAREA") {
            currentNode.addEventListener('change', teemoTraceInputHandler, true);
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

function teemoUpStep(idx) {
    if (idx == 0) return;
    let step = teemoScenerioData.steps[idx - 1];
    teemoScenerioData.steps[idx - 1] = teemoScenerioData.steps[idx];
    teemoScenerioData.steps[idx] = step;
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
            <div id='removeStepCard_${idx}' class=" teemo teemo-one-container-close" onclick="teemoRemoveStep(${idx})"    >X</div>
            <div id='upStepCard_${idx}' class=" teemo teemo-one-container-up" onclick="teemoUpStep(${idx})"    >↑</div>
            <div class=" teemo " > 
                <div   class=" teemo " >action: ${step.action}</div><br/>
                <span class=" teemo " >xpath:</span><input onchange='modifyXpath(${idx}, event)' class="teemo teemo-step-card-value" type="text" value="${step.xpath}"     /><br/><br/>
                <span class=" teemo " >tips: </span><input onchange='modifyTips(${idx}, event)'  class="teemo teemo-step-card-tips" type="text" value="${step.tips}" />
            </div>
        `
        } else if(step.action == 'input') {
            stepCard.innerHTML = `
            <div id='removeStepCard_${idx}' class="teemo teemo-one-container-close" onclick="teemoRemoveStep(${idx})"  >X</div>
            <div id='upStepCard_${idx}' class=" teemo teemo-one-container-up" onclick="teemoUpStep(${idx})"    >↑</div>
            <div  class=" teemo "  > 
                <div  class=" teemo "  >action: ${step.action}</div><br/>
                <span  class=" teemo "  >value:</span><input onchange='modifyValue(${idx}, event)'  class="teemo teemo-step-card-value" type="text" value="${step.value}"   /><br/><br/>
                <span  class=" teemo " >tips: </span><input onchange='modifyTips(${idx}, event)'   class="teemo teemo-step-card-tips" type="text" value="${step.tips}" />
            </div>
        `
        } else if (step.action == 'go') {
            stepCard.innerHTML = `
            <div  id='removeStepCard_${idx}' class="teemo teemo-one-container-close" onclick="teemoRemoveStep(${idx})">X</div>
            <div id='upStepCard_${idx}' class=" teemo teemo-one-container-up" onclick="teemoUpStep(${idx})"    >↑</div>
            <div  class=" teemo "  > 
                <div  class=" teemo "  >action: ${step.action}</div><br/>
                <span  class=" teemo "  >url:  </span><input onchange='modifyUrl(${idx}, event)'  class="teemo teemo-step-card-value" type="text" value="${step.url}"   /><br/><br/>
                <span   class=" teemo " >tips: </span><input onchange='modifyTips(${idx}, event)'   class="teemo teemo-step-card-tips" type="text" value="${step.tips}" />
            </div>
        `
        } else if (step.action == "sleep") {
            stepCard.innerHTML = `
            <div  id='removeStepCard_${idx}' class="teemo teemo-one-container-close" onclick="teemoRemoveStep(${idx})">X</div>
            <div id='upStepCard_${idx}' class=" teemo teemo-one-container-up" onclick="teemoUpStep(${idx})"    >↑</div>
            <div  class=" teemo "  > 
                <div  class=" teemo "  >action: ${step.action}</div><br/>
                <span  class=" teemo "  >time/s:  </span><input  onchange='modifyTime(${idx}, event)' class="teemo teemo-step-card-value" type="text" value="${step.time}"   /><br/><br/>
                <span   class=" teemo " >tips: </span><input onchange='modifyTips(${idx}, event)'   class="teemo teemo-step-card-tips" type="text" value="${step.tips}" />
            </div>
        `
        }
        
        container.appendChild(stepCard);
    }
}


function addWait() {
    teemoScenerioData.steps.push({
        action: 'sleep',
        time: 1,
        tips: ''
    })
    rebuildStepCards();
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









