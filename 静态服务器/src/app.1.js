let config = require('./config');
let fs = require('fs');
let url = require('url');
let http = require('http');
let path = require('path');
let mime = require('mime');
let chalk = require('chalk');
let util = require('util');
let debug = require('debug')('static:app');
let stat = util.promisify(fs.stat);

// 模板内容
let ejs = require('ejs');
let tmpl = fs.readFileSync(path.join(__dirname, 'tmpl.ejs'), 'utf8');

class Server {
    constructor() {
        this.config = config;
        this.tmpl = tmpl;
    }
    handleRequest() {
        return async (req, res) => {
            let { pathname } = url.parse(req.url, true);
            let p = path.join(this.config.dir, '.' + pathname);
            try {
                let statObj = await stat(p);
                if (statObj.isDirectory()) {    // 判断是不是目录（文件夹）
                    // ejs模板引擎渲染
                    ejs.render(this.tmpl,{dirs});
                    
                } else {
                    this.sendFile(req, res, p, statObj)
                }
            } catch (e) {
                this.sendError(req, res, e);
            }
        }
    }
    sendFile(req, res, p, statObj) {
        res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8');
        fs.createReadStream(p).pipe(res);
    }
    sendError(req, res, e) {
        debug(util.inspect(e).toString());      // util 模块解析错误数据
        res.statusCode = 404;
        res.end();
    }
    start() {
        let { port, hostname } = this.config;
        let server = http.createServer(this.handleRequest());
        let url = `http://${hostname}:${chalk.green(port)}`;
        debug(url);
        server.listen(port, hostname);
    }
}
let server = new Server();
server.start();