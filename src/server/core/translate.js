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

function processBefore(beforeName, beforeQueue) {
    if (beforeName) {
        let realBeforePath = path.join(__dirname, `${beforeName}.json`);
        let stat = fs.statSync(realBeforePath);
        if (stat.isFile()) {
            let content = JSON.parse(fs.readFileSync(realBeforePath).toString());
            if (content.before) {
                processBefore(content.before, beforeQueue);
            }
            content.steps.forEach(step => {
                stepCode = compile(step);
                beforeStepQueue.push(stepCode)
            })
        } else {
            throw new Error(`${realBeforePath} not exist`)
        }
    }
}

function processSteps(steps, stepQueue) {
    steps.forEach(step => {
        stepCode = compile(step);
        stepQueue.push(stepCode)
    })
}

function compile(step) {
    switch(step.action) {
        case 'go': return compileGo(step);
        case 'click': return compileClick(step);
        case 'input': return compileInput(step);
        case 'sleep': return compileSleep(step);
        case 'assert': return compileAssert(step);
        default: throw new Error(`unrecognized action: ${step.action}`);
    }

}

function compileGo(step) {
    return `await Driver.get('${step.url}');`;
}

function compileClick(step) {
    return `await Driver.findElement(By.xpath('${step.xpath}')).click();`;
}

function compileInput(step) {
    return `await Driver.switchTo().activeElement().sendKeys('${step.value}');`;
}

function compileSleep(step) {
    return `await Driver.sleep(${step.time * 1000});`
}

function compileAssert(step) {
    let tp1 = `t_param_${Math.floor(Math.random() * 1000000)}`;
    let tp2 = `t_param_${Math.floor(Math.random() * 1000000)}`;
    if (step.type = "elementToValue") {
        return 
`
let ${tp1} = ${_compileExtractValue(step.targets[0])};
let ${tp2} = ${step.expectedValue};
assert( ${tp1} ${step.condition} ${tp2}, \`${step.message}(\$\{${tp1}\} ${step.condition} \$\{${tp2})\}\`);             
`;
    } else {
        return 
`
let ${tp1} = ${_compileExtractValue(step.targets[0])};
let ${tp2} = ${_compileExtractValue(step.targets[1])};
assert( ${tp1} ${step.condition} ${tp2}, \`${step.message}(\$\{${tp1}\} ${step.condition} \$\{${tp2})\}\`);
`
    }
}

function _compileExtractValue(tip) {
    if (tip.isAttribute) {
        return `await Driver.findElement(By.xpath('${step.targets[0].xpath}')).getAttribute('${tip.attributeName}');`;
    }
    return `await Driver.findElement(By.xpath('${step.targets[0].xpath}')).getText();`
}