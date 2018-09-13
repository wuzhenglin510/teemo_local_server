const PowerServer = require('node_power_server')
const path = require("path")

module.exports = async () => {
    return await new Promise((resolve, reject) => {
        const server = new PowerServer.Server({
            port: 6385,
            staticRoot: `${path.join(__dirname, "./resources")}`,
            handlerDir: `${path.join(__dirname, "./api")}`
        });
        server.on('started', (msg) => {
            console.log(msg)
            resolve(msg)
        })
        server.on('init_process', (msg) => {console.log(msg)})
        //服务端报错，可以监听error事件，打印日志
        server.on("error", err => {
            console.log(err)
            reject(err)
        })
        server.start()
    })
    
}