/**
 * 测试脚本全局自定义函数
 * --------------------------------------
 * demo: 必须使用 global.[函数名] = function([params...])的方式声明自定义函数
global.randomPatientName = function () {
    let names = [
        "可馨",
        "倩雪",
        "子萱",
        "语嫣",
        "梦瑶",
        "婉婷"
    ];
    return names[Math.floor(Math.random(names.length))]
}
 */

global.randomPatientName = function () {
    let names = [
        "可馨",
        "倩雪",
        "子萱",
        "语嫣",
        "梦瑶",
        "婉婷"
    ];
    return names[Math.floor(Math.random(names.length))]
}