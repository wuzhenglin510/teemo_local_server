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
var appendedAmount = 0;
var lastEventTriggerTime = {
    input: new Date().getTime() + 3000,
    click: new Date().getTime() + 3000,
    keydown: new Date().getTime()
};
var lastClickXpath = '';
var teemoInPickProcess = false;
var teemoInHoverProcess = false;
var teemoinPickingStart = false;
var currentPickXpath = '';
var currentPickAttribute = '';
var lastAction = '';

function shouldIgnoreThisEvent(last) {
    let now = new Date().getTime();
    return (now - last) < 200;
}


function teemoCreatePrepare() {
    var prepare = document.createElement('DIV');
    prepare.id = 'teemo-waiting-finish';
    prepare.className = 'teemo teemo-waiting-finish teemo-hide';
    prepare.innerHTML = `<h1 class='teemo teemo-prepare'>渲染中，请稍等</h1>`;
    document.body.appendChild(prepare);
}

function teemoProcessPick(event) {
    let top = event.clientY;
    let left = event.clientX;
    let cxpath = teemoGetElementXPath(event.toElement);
    let bb = cxpath.split('/');
    if (bb[3] && bb[3].indexOf('[') != -1) {
        let pat = /(.*\[)(\d+)(\].*)/;
        let mbb = bb[3].match(pat)
        let idx = parseInt(mbb[2])
        // console.log(`idx: ${idx}`)
        // console.log(`appendedAmount: ${appendedAmount}`)
        if (idx >= (appendedAmount)) idx = (idx - 2)
        bb[3] = `${mbb[1]}${idx}${mbb[3]}`
        // console.log(`idx: ${idx}`)
        cxpath = bb.join('/');
    }
    currentPickXpath = cxpath;
    let card = document.getElementById('teemo-pick-card');
    card.innerHTML = '';
    
    for (let attribute of event.target.attributes) {
        let item = document.createElement('div');
        item.innerHTML = `
        <label class='teemo-pick-radio'><input type='radio' onchange='teemoPickChange('${attribute.name}')' name='teemo-pick-input' value='${attribute.name}' /><span class='teemo-pick-outer'><span class='teemo-pick-inner'></span></span>${attribute.name} --> ${attribute.value}</label>
        `
        card.appendChild(item);
    }
    let item = document.createElement('div');
    item.innerHTML = `
        <label class='teemo-pick-radio'><input type='radio' onchange='teemoPickChange('innerText')' name='teemo-pick-input' value='innerText' /><span class='teemo-pick-outer'><span class='teemo-pick-inner'></span></span>innerText --> ${event.target.innerText}</label>
        `
    card.appendChild(item);
    document.getElementById('teemo-pick').style = `display: block; top:${top}px; left: ${left}px`;
}

function teemoProcessHover(event) {
    let cxpath = teemoGetElementXPath(event.toElement);
    let bb = cxpath.split('/');
    if (bb[3] && bb[3].indexOf('[') != -1) {
        let pat = /(.*\[)(\d+)(\].*)/;
        let mbb = bb[3].match(pat)
        let idx = parseInt(mbb[2])
        // console.log(`idx: ${idx}`)
        // console.log(`appendedAmount: ${appendedAmount}`)
        if (idx >= (appendedAmount)) idx = (idx - 2)
        bb[3] = `${mbb[1]}${idx}${mbb[3]}`
        // console.log(`idx: ${idx}`)
        cxpath = bb.join('/');
    }
    currentPickXpath = cxpath;
    teemoScenerioData.steps.push({
        action: 'hover',
        xpath: currentPickXpath,
        time: 1,
        tips: '默认悬停1秒'
    })
    lastAction = 'hover';
    teemoInHoverProcess = false;
    rebuildStepCards();
}

function teemoPickChange(attribute) {
    currentPickAttribute = attribute;
}

function confirmPick() {
    teemoInPickProcess = false;
    teemoinPickingStart = false;
    teemoScenerioData.steps.push({
        action: 'pick',
        xpath: currentPickXpath,
        attribute: currentPickAttribute,
        variable: `p_${Math.floor(Math.random() * 100000)}`,
        tips: ''
    })
    lastAction = 'pick';
    document.getElementById('teemo-pick').style = `display: none;`;
    rebuildStepCards();
}

function teemoTraceOnclickHandler(event) {
    if (teemoInPickProcess) {
        if (!teemoinPickingStart) {
            teemoinPickingStart = true;
            teemoProcessPick(event);
        } else {
            return;
        }
    } else if (teemoInHoverProcess) {
        lastEventTriggerTime.click = new Date().getTime()
        teemoProcessHover(event);
    }
    else {
        if (shouldIgnoreThisEvent(lastEventTriggerTime.click)) {
            return;
        }
        let cxpath = teemoGetElementXPath(event.toElement);
        let bb = cxpath.split('/');
        if (bb[3] && bb[3].indexOf('[') != -1) {
            let pat = /(.*\[)(\d+)(\].*)/;
            let mbb = bb[3].match(pat)
            let idx = parseInt(mbb[2])
            if (idx >= (appendedAmount)) idx = (idx - 2)
            bb[3] = `${mbb[1]}${idx}${mbb[3]}`
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
        lastAction = 'click';
        rebuildStepCards();
    }
    
}


function startPickProcess() {
    teemoInPickProcess = true;
}

function startHoverProcess() {
    teemoInHoverProcess = true;
}

function teemoTraceInputHandler(element) {
    // element.stopPropagation();
    if (shouldIgnoreThisEvent(lastEventTriggerTime.input)) {
        return;
    }
    lastEventTriggerTime.input = new Date().getTime()

    if (lastAction == 'keydown' && (new Date().getTime() - lastEventTriggerTime.keydown) < 100) {
        let trs = teemoScenerioData.steps[teemoScenerioData.steps.length -1];
        teemoScenerioData.steps[teemoScenerioData.steps.length -1] = {
            action: 'input',
            valType: 'text',
            value: element.target.value,
            tips: ''
        }
        teemoScenerioData.steps.push(trs);
    } else {
        teemoScenerioData.steps.push({
            action: 'input',
            valType: 'text',
            value: element.target.value,
            tips: ''
        })
    }
    lastAction = 'input';
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

function modifyInputValueType(idx, type) {
    teemoScenerioData.steps[idx].valType = type;
}

function modifyAttribute(idx, event) {
    teemoScenerioData.steps[idx].attribute = event.target.value;
}

function modifyVariable(idx, event) {
    teemoScenerioData.steps[idx].variable = event.target.value;
}

function modifyCode(idx, event) {
    teemoScenerioData.steps[idx].code = event.target.value;
}
  

function teemoPost(uri, data) {
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', uri, true);
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
        if (currentNode.className && currentNode.className.indexOf && currentNode.className.indexOf('teemo') != -1) {
            // console.log('teemo component needless registy listener')
            return;
        } 
        teemoInjectListenerInEveryNode(currentNode.childNodes);
        currentNode.addEventListener('click', teemoTraceOnclickHandler, true);
        if (currentNode.nodeName.toUpperCase() == 'INPUT') {
            if (currentNode.type.toLowerCase() != 'radio' && currentNode.type.toLowerCase() != 'checkbox') {
                currentNode.addEventListener('change', teemoTraceInputHandler, true);
            }
        }
        if (currentNode.nodeName.toUpperCase() == 'TEXTAREA') {
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
        stepCard.className = 'teemo teemo-one-step-container';
        if (step.action == 'click') {
            stepCard.innerHTML = `
            <div id='removeStepCard_${idx}' class=' teemo teemo-one-container-close' onclick='teemoRemoveStep(${idx})'    >X</div>
            <div id='upStepCard_${idx}' class=' teemo teemo-one-container-up' onclick='teemoUpStep(${idx})'    >↑</div>
            <div class=' teemo ' > 
                <div   class=' teemo ' >action: ${step.action}</div><br/>
                <span class=' teemo ' >xpath:</span><input onchange='modifyXpath(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.xpath}'     /><br/><br/>
                <span class=' teemo ' >tips: </span><input onchange='modifyTips(${idx}, event)'  class='teemo teemo-step-card-tips' type='text' value='${step.tips}' />
            </div>
        `
        } else if(step.action == 'input') {
            stepCard.innerHTML = `
            <div id='removeStepCard_${idx}' class='teemo teemo-one-container-close' onclick='teemoRemoveStep(${idx})'  >X</div>
            <div id='upStepCard_${idx}' class=' teemo teemo-one-container-up' onclick='teemoUpStep(${idx})'    >↑</div>
            <div  class=' teemo '  > 
                <div  class=' teemo '  >action: ${step.action}</div><br/>
                <div  class=' teemo '  >
                    valType: 
                    <input type='radio' onchange='modifyInputValueType(${idx}, "text")' class='teemo' ${step.valType == 'text' ? checked='checked' : ''}  name='teemo_input_value_type_${idx}' value='text'>
                    <label class='teemo'>t</label>
                    <input type='radio' onchange='modifyInputValueType(${idx}, "code")' class='teemo' ${step.valType == 'code' ? checked='checked' : ''}  name='teemo_input_value_type_${idx}' value='code'>
                    <label class='teemo'>c</label>
                </div ><br/>
                <span  class=' teemo '  >value:</span><input onchange='modifyValue(${idx}, event)'  class='teemo teemo-step-card-value' type='text' value='${step.value}'   /><br/><br/>
                <span  class=' teemo ' >tips: </span><input onchange='modifyTips(${idx}, event)'   class='teemo teemo-step-card-tips' type='text' value='${step.tips}' />
            </div>
        `
        } else if (step.action == 'go') {
            stepCard.innerHTML = `
            <div  id='removeStepCard_${idx}' class='teemo teemo-one-container-close' onclick='teemoRemoveStep(${idx})'>X</div>
            <div id='upStepCard_${idx}' class=' teemo teemo-one-container-up' onclick='teemoUpStep(${idx})'    >↑</div>
            <div  class=' teemo '  > 
                <div  class=' teemo '  >action: ${step.action}</div><br/>
                <span  class=' teemo '  >url:  </span><input onchange='modifyUrl(${idx}, event)'  class='teemo teemo-step-card-value' type='text' value='${step.url}'   /><br/><br/>
                <span   class=' teemo ' >tips: </span><input onchange='modifyTips(${idx}, event)'   class='teemo teemo-step-card-tips' type='text' value='${step.tips}' />
            </div>
        `
        } else if (step.action == 'sleep') {
            stepCard.innerHTML = `
            <div  id='removeStepCard_${idx}' class='teemo teemo-one-container-close' onclick='teemoRemoveStep(${idx})'>X</div>
            <div id='upStepCard_${idx}' class=' teemo teemo-one-container-up' onclick='teemoUpStep(${idx})'    >↑</div>
            <div  class=' teemo '  > 
                <div  class=' teemo '  >action: ${step.action}</div><br/>
                <span  class=' teemo '  >time/s:  </span><input  onchange='modifyTime(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.time}'   /><br/><br/>
                <span   class=' teemo ' >tips: </span><input onchange='modifyTips(${idx}, event)'   class='teemo teemo-step-card-tips' type='text' value='${step.tips}' />
            </div>
        `
        } else if (step.action == 'pick') {
            stepCard.innerHTML = `
            <div  id='removeStepCard_${idx}' class='teemo teemo-one-container-close' onclick='teemoRemoveStep(${idx})'>X</div>
            <div id='upStepCard_${idx}' class=' teemo teemo-one-container-up' onclick='teemoUpStep(${idx})'    >↑</div>
            <div  class=' teemo '  > 
                <div  class=' teemo '  >action: ${step.action}</div><br/>
                <span  class=' teemo '  >attr:  </span><input  onchange='modifyAttribute(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.attribute}'   /><br/><br/>
                <span class=' teemo ' >xpath:</span><input onchange='modifyXpath(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.xpath}'     /><br/><br/>
                <span  class=' teemo '  >vname:  </span><input  onchange='modifyVariable(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.variable}'   /><br/><br/>
                <span   class=' teemo ' >tips: </span><input onchange='modifyTips(${idx}, event)'   class='teemo teemo-step-card-tips' type='text' value='${step.tips}' />
            </div>
        `
        } else if (step.action == 'exp') {
            stepCard.innerHTML = `
            <div  id='removeStepCard_${idx}' class='teemo teemo-one-container-close' onclick='teemoRemoveStep(${idx})'>X</div>
            <div id='upStepCard_${idx}' class=' teemo teemo-one-container-up' onclick='teemoUpStep(${idx})'    >↑</div>
            <div  class=' teemo '  > 
                <div  class=' teemo '  >action: ${step.action}</div><br/>
                <span  class=' teemo '  >code:  </span><input  onchange='modifyCode(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.code}'   /><br/><br/>
                <span  class=' teemo '  >vname:  </span><input  onchange='modifyVariable(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.variable}'   /><br/><br/>
                <span   class=' teemo ' >tips: </span><input onchange='modifyTips(${idx}, event)'   class='teemo teemo-step-card-tips' type='text' value='${step.tips}' />
            </div>
        `
        } else if (step.action == 'hover') {
            stepCard.innerHTML = `
            <div  id='removeStepCard_${idx}' class='teemo teemo-one-container-close' onclick='teemoRemoveStep(${idx})'>X</div>
            <div id='upStepCard_${idx}' class=' teemo teemo-one-container-up' onclick='teemoUpStep(${idx})'    >↑</div>
            <div  class=' teemo '  > 
                <div  class=' teemo '  >action: ${step.action}</div><br/>
                <span class=' teemo ' >xpath:</span><input onchange='modifyXpath(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.xpath}'     /><br/><br/>
                <span  class=' teemo '  >time/s:  </span><input  onchange='modifyTime(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.time}'   /><br/><br/>
                <span   class=' teemo ' >tips: </span><input onchange='modifyTips(${idx}, event)'   class='teemo teemo-step-card-tips' type='text' value='${step.tips}' />
            </div>
        `
        } else if (step.action == 'assert') {
            stepCard.innerHTML = `
            <div  id='removeStepCard_${idx}' class='teemo teemo-one-container-close' onclick='teemoRemoveStep(${idx})'>X</div>
            <div id='upStepCard_${idx}' class=' teemo teemo-one-container-up' onclick='teemoUpStep(${idx})'    >↑</div>
            <div  class=' teemo '  > 
                <div  class=' teemo '  >action: ${step.action}</div><br/>
                <span  class=' teemo '  >code:  </span><input  onchange='modifyCode(${idx}, event)' class='teemo teemo-step-card-value' type='text' value='${step.code}'   /><br/><br/>
                <span   class=' teemo ' >tips: </span><input onchange='modifyTips(${idx}, event)'   class='teemo teemo-step-card-tips' type='text' value='${step.tips}' />
            </div>
        `
        } else if (step.action == 'keydown') {
            stepCard.innerHTML = `
            <div  id='removeStepCard_${idx}' class='teemo teemo-one-container-close' onclick='teemoRemoveStep(${idx})'>X</div>
            <div id='upStepCard_${idx}' class=' teemo teemo-one-container-up' onclick='teemoUpStep(${idx})'    >↑</div>
            <div  class=' teemo '  > 
                <div  class=' teemo '  >action: ${step.action}</div><br/>
                <span  class=' teemo '  >code:  </span><input  class='teemo teemo-step-card-value' type='text' value='${step.key}'  disabled='disabled' /><br/><br/>
                <span   class=' teemo ' >tips: </span><input onchange='modifyTips(${idx}, event)'   class='teemo teemo-step-card-tips' type='text' value='${step.tips}' />
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
    lastAction = 'wait';
    rebuildStepCards();
}

function addExpression() {
    teemoScenerioData.steps.push({
        action: 'exp',
        code: '',
        variable: `p_${Math.floor(Math.random() * 100000)}`,
        tips: ''
    })
    lastAction = 'exp';
    rebuildStepCards();
}


function addAssert() {
    teemoScenerioData.steps.push({
        action: 'assert',
        code: '',
        tips: ''
    })
    lastAction = 'assert';
    rebuildStepCards();
}

document.addEventListener('keydown', function(event) {
    if(event.code == 'Enter') {
        teemoScenerioData.steps.push({
            action: 'keydown',
            key: 'Enter',
            tips: 'tap key Enter'
        });
        lastEventTriggerTime.keydown = new Date().getTime();
        lastAction = 'keydown';
        rebuildStepCards();
    } else if (event.code == 'Tab') {
        teemoScenerioData.steps.push({
            action: 'keydown',
            key: 'Tab',
            tips: 'tap key Tab'
        });
        lastEventTriggerTime.keydown = new Date().getTime();
        lastAction = 'keydown';
        rebuildStepCards();
    }
    
})


var teemoObserveRootNode = document.body;
var teemoObserveConfig = {childList: true, subtree: true };
function teemoObserveEventHandler (mutationsList) {
    // console.log('监听到变化')
    for(let mutation of mutationsList) {
        if (mutation.target.className.indexOf('teemo') == -1) {
            teemoInjectListenerInEveryNode(mutation.addedNodes)
        } else {
            // console.log('teemo dom needless registy listener')
        }
    }
};

var teemoObserver = new MutationObserver(teemoObserveEventHandler);
teemoObserver.observe(teemoObserveRootNode, teemoObserveConfig);









