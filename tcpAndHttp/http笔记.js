

// URI&URL
// URI是统一资源标识符 就像一个身份证号，可以准确的表示一个资源，但是不能准且的定位到这个资源
// URL是统一资源定位符 基于URI的，是URI的一部分，它可以准且的定位到一个资源

// URL的格式
// 协议类型(http/https)
// 在//后面一般用户名和密码@隔开
// 服务器地址(网址)
// 端口号(默认:80)
// 文件路径
// 在?后面是查询字符串(携带的数据)
// 片段标识符 hash 锚点(用来定位页面位置) 在服务端是拿不到的


//URL模块
let url = require('url');
let u = 'http://jiangwen:xxxx@www.baidu.com:80/abc/index.html?a=1&b=2#hash';
let urlObj = url.parse(u, true);     // 加上true可以将查询字符串转化成对象
console.log(urlObj.query);  // 查询字符串
console.log(urlObj.pathname); // 路径


// http
// http是应用层，是基于http的
// http特点
// 1.长连接
// 意思就是经过三次握手以后就持续的，不停的发请求和响应

// 2.管线化
// 意思就是在同一时间可以并发多个请求，如chrome浏览器就是默认并发六个,firefox是四个

// 状态码识别
// 2xx 成功状态码
// 200 成功
// 204 正常响应，没有实体
// 206 范围请求 返回部分数据（断点续传）
// 3xx 重定向（缓存）
// 301 永久重定向
// 302 临时重定向 （负载均衡，访问到其他网页上）
// 303 和302类似，但是必须用GET方法
// 304 状态未改变
// 4xx
// 400 语法错误
// 401 需要认证，有权限问题
// 403 服务器拒绝访问相对资源
// 404 无法找到资源
// 5xx
// 500 服务器故障
// 503 服务器超负荷（负载均衡超载） 或者 正在停机维护

// http模块
// 请求头示例
// POST / HTTP/1.1
// > Host: www.baidu.com
// > User-Agent: curl/7.46.0
// > Accept: */*
// > Content-Length: 11
// > Content-Type: application/x-www-form-urlencoded

let http = require('http');
// let server = http.createServer(function(req,res){

// });
// 或者
// 创建服务
let server = http.createServer();
// 监听请求的到来
// req是可读流
// res是可写流
// http(req)
server.on('request', function (req, res) {
    let method = req.method;
    let httpVersion = req.httpVersion
    let headers = req.headers;
    // console.log(method);
    // console.log(httpVersion);
    // console.log(headers);
    let buffers = [];
    // 如果没有请求体 不会走on('data'),也会触发end事件
    req.on('data', function (data) {
        buffers.push(data);
    });
    req.on('end', function () {
        console.log(Buffer.concat(buffers).toString());
        res.write('hello');
        res.end('world');
    });
});
// 建立链接
server.on('connection', function (socket) {

});
// 关闭
server.on('close', function () {

});
// 监听错误
server.on('error', function (err) { })
server.listen(8080);



// 简单实现http(req)
let net = require('net');
let { StringDecoder } = require('string_decoder');    // 专门解决buffer乱码的模块
let { Readable } = require('stream');
class IncomingMessage extends Readable {     //自定义可读流
    _read() { }
}
function parser(socket, callback) {
    let buffers = []; // 每次读取的数据，放到数组中
    let sd = new StringDecoder();
    let im = new IncomingMessage();
    function fn() {
        let res = { write: socket.write.bind(socket), end: socket.end.bind(socket) }
        let content = socket.read();  // 默认将缓存区内容读完，读完后如果还有内容会触发readable事件
        buffers.push(content);
        let str = sd.write(Buffer.concat(buffers));
        if (str.match(/\r\n\r\n/)) {
            let result = str.split('\r\n\r\n');
            let head = parserHeader(result[0]);
            Object.assign(im, head);
            socket.removeListener('readable', fn);   // 移除监听
            socket.unshift(Buffer.from(result[1]));     // 将内容塞回流中
            if (result[1]) { // 有请求体
                socket.on('data', function (data) {
                    im.push(data);
                    im.push(null);
                    callback(im, res);
                });
            } else { // 没请求体
                im.push(null);
                callback(im, res);
            }
            //let body = result[1];
        }
    }
    socket.on('readable', fn);
}
function parserHeader(head) {
    let lines = head.split(/\r\n/);
    let start = lines.shift();
    let method = start.split(' ')[0];
    let url = start.split(' ')[1];
    let httpVersion = start.split(' ')[2].split('/')[1];
    let headers = {};
    lines.forEach(line => {
        let row = line.split(': ');
        headers[row[0]] = row[1];
    });
    return { url, method, httpVersion, headers }
}
let server = net.createServer(function (socket) {
    parser(socket, function (req, res) {
        server.emit('request', req, res);
    });
});
server.on('request', function (req, res) {
    console.log(req.url);
    console.log(req.headers);
    console.log(req.httpVersion);
    console.log(req.method);

    req.on('data', function (data) {
        console.log('ok', data.toString());
    });
    req.on('end', function () {
        res.end(`qxlltc
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 5

hello`)
    });
})
server.on('connection', function () {
    console.log('建立连接');
});
server.listen(3000);

// http(res)
let http = require('http');
let server = http.createServer(function (req, res) {
    // res.write()
    // res.end()
    // write方法不能再end之后调用
    // 响应可以设置响应头


    // 不会真正的把响应头写给客户端 你只要调用write或者end才会吧响应头写进去
    // res.writeHead(200,{'Content-Type':'text/plain'}); 会真正的写进去 之后就不能再setHeader 这两个方法冲突
    // res.statusCode = 200;     // 默认情况下返回给客户端内容 200
    // res.setHeader('Content-Type','text/plain');   // 调用write之前才能调用setHeader方法
    // res.setHeader('name','aaaa');             // 自定义的头部

    // console.log(res.getHeader('name'));      //获取相应头
    // console.log(res.removeHeader('name'));   // 删除响应头
    res.sendDate = false;      //是否发送日期
    // Content-Length:2     // 发送的数据长度
    res.end('ok');      // 最后调用end结束
});

// 多语言 vue-i18n国际化的包
// 可以支持语言的切换

// 这个可以客户端设置，也可以服务端设置
// 现在要说的就是服务端如何设置多语言
// Accept-Language: zh;q=0.9,en;fr-FR,q=0.7  逗号前面是语言，后面是权重，最大是1

let pack = {
    'zh-CN': { content: '你好' },
    'en': { content: 'hello' },
    'fr-FR': { content: 'Bonjour' }
};
let http = require('http');
let server = http.createServer();
server.on('request', function (req, res) {
    let lan = 'en';     // 设置默认语言
    let language = req.headers['accept-language'];
    let arrs = [];
    if (language) {
        arrs = language.split(',').map(l => {
            l = l.split(';');
            return {
                name: l[0],
                q: l[1] ? Number(l[1].split('=')[1]) : 1
            }
        }).sort((lang1, lang2) => lang2.q - lang1.q);
        console.log(arrs);
    }
    res.setHeader('Content-Type','text/plain;charset=utf8');
    for (let i = 0; i < arrs.length; i++) {
        let name = arrs[i].name;
        if (pack[name]) {
            res.end(pack[name].content);
            break;
        }
    }
    res.end(pack[lan].content);
}).listen(8888);


// 防盗链

