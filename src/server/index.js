const PowerServer = require('node_power_server')
const path = require("path")
const log4js = require('log4js');


module.exports = async () => {
    return await new Promise((resolve, reject) => {
        log4js.configure({
            appenders: { file: { type: 'file', filename: path.join(ProjectRoot, 'server.log')} },
            categories: { default: { appenders: ['file'], level: 'debug' } }
        });
        const logger = log4js.getLogger('file');

        const server = new PowerServer.Server({
            port: 6385,
            staticRoot: `${path.join(__dirname, "./resources")}`,
            handlerDir: `${path.join(__dirname, "./api")}`
        });
        server.middlewareManage.add("/*", PowerServer.Middleware.CrossDomain(), PowerServer.Middleware.Constant.ExecBefore)
        server.on('started', (msg) => {
            console.log(msg)
            logger.info(msg)
            resolve(msg)
        })
        server.on('init_process', (msg) => {
            console.log(msg);
            logger.info(msg)
        })
        //服务端报错，可以监听error事件，打印日志
        server.on("error", err => {
            console.log(err)
            logger.error(err)
            reject(err)
        })
        server.start()
    })
    
}