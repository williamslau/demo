let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');
class Koa {
    constructor() {
        this.callbackFn;
        this.context = context;
        this.request = request;
        this.response = response;
    }
    createContext(req, res) {
        // 为了不修改原型上request.js里的内容
        // ctx.a=1;
        // 这样request.js里的内容也就改了
        // cex.__proto__=this.context;
        // 创建上下文
        let ctx = Object.create(this.context);
        // 创建request
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }
    handleRequest() {
        return (req, res) => {
            // this.callbackFn(req, res);
            // 创建上下文对象
            let ctx = this.createContext(req, res);
            Promise.resolve(this.callbackFn(ctx)).then(function(){
                // ctx.body后，执行end不让他转圈
                res.end(ctx.body);
            });
        }
    }
    listen() {
        let server = http.createServer(this.handleRequest());
        server.listen(...arguments);
    }
    use(fn) {
        this.callbackFn = fn;
    }
}

module.exports = Koa;