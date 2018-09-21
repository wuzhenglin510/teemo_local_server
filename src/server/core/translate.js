const fs = require("fs")
const path = require("path")

module.exports = function (data) {
    let ret = {
        scenerioName: data.scenerioName,
        before: [],
        steps: []
    }
    processBefore(data.before, ret.before);
    processSteps(data.steps, ret.steps);
    return ret;
}

function processBefore(beforeName, beforeStepQueue) {
    if (beforeName) {
        let realBeforePath = path.join(ProjectRoot, 'raw/group', beforeName);
        let stat = fs.statSync(realBeforePath);
        if (stat.isFile()) {
            let content = JSON.parse(fs.readFileSync(realBeforePath).toString());
            if (content.before) {
                processBefore(content.before, beforeStepQueue);
            }
            content.steps.forEach(step => {
                stepCode = compile(step);
                beforeStepQueue.push(stepCode)
                beforeStepQueue.push(`// ${step.tips}`)
            })
        } else {
            throw new Error(`${realBeforePath} not exist`)
        }
    }
}

function processSteps(steps, stepQueue) {
    steps.forEach(step => {
        stepCode = compile(step);
        stepQueue.push(stepCode);
        stepQueue.push(`// ${step.tips}`)
    })
}

function compile(step) {
    switch(step.action) {
        case 'go': return compileGo(step);
        case 'click': return compileClick(step);
        case 'input': return compileInput(step);
        case 'sleep': return compileSleep(step);
        case 'assert': return compileAssert(step);
        case 'pick': return compilePick(step);
        case 'exp': return compileExp(step);
        case 'keydown': return compileKeydown(step);
        default: throw new Error(`unrecognized action: ${step.action}`);
    }

}

function compileGo(step) {
    return `await Driver.get('${step.url}');`;
}

function compileClick(step) {
    return `await Driver.findElement(By.xpath('${step.xpath}')).click();`;
}

function compileKeydown(step) {
    if (step.key == "Enter") {
        return `await Driver.switchTo().activeElement().sendKeys(Key.ENTER);`;
    } else if (step.key == "Tab") {
        return `await Driver.switchTo().activeElement().sendKeys(Key.TAB);`;
    }
}

function compileInput(step) {
    if (step.valType == "code") {
        return `await Driver.switchTo().activeElement().sendKeys(\`\$\{${step.value}\}\`);`;
    } else {
        return `await Driver.switchTo().activeElement().sendKeys('${step.value}');`;
    }
}

function compileSleep(step) {
    return `await Driver.sleep(${step.time * 1000});`
}


function compilePick(step) {
    return `let ${step.variable} = ${_compileExtractValue(step)}`;
}

function compileExp(step) {
    return `let ${step.variable} = ${step.code}`;
}

function compileAssert(step) {
    return `assert( ${step.code})`;
}

function _compileExtractValue(step) {
    if (step.attribute != "innerText") {
        return `await Driver.findElement(By.xpath('${step.xpath}')).getAttribute('${tip.attributeName}');`;
    }
    return `await Driver.findElement(By.xpath('${step.xpath}')).getText();`
}