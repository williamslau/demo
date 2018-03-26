//console

// 标准输出
console.log('log');
console.info('info');

// 错误输出
console.warn('warn');
console.error('error');
// 标准输出 是1表示  错误输出是2表示

// 默认有些属性是隐藏属性,打印隐藏属性
console.dir(Array.prototype, { showHidden: true });

// time 和 timeEnd中的内容是一对 名字相同，相同时才能打印出两段时间的间隔
console.time('label');
for (var i = 0; i < 1000; i++) { }
console.timeEnd('label');

// console.trace()打印函数调用栈 (栈 指的就是代码的调用栈 先进后出 函数调用)
console.log(1);
console.log(2);
function one() {
    var a = 1;
    console.log(a);
    two();
    function two() {
        var b = 2;
        console.log(b)
        three();
        function three() {
            console.log(5);
            console.trace();
        }
    }
}
one();

// console断言  会抛出一个AccertException
console.assert((1 + 3) === 2, 'error');

// process 进程
// argv  后续我们在执行时可能会传递参数 http-server --port 3000
// pid 进程id 端口占用的情况 任务管理器 lsof -i :8080 kill -9 id号
// chdir()  设置工作工作目录(change directory)
process.chdir('..');
// cwd()  当前工作目录(current working directory)
console.log(process.cwd());
// nextTick() 微任务
// nextTick的用法
function Fn() {
    this.arrs;  //此时arrs还不是函数不能执行
    process.nextTick(() => {
        this.arrs();
    })
}
Fn.prototype.then = function () {
    this.arrs = function () { console.log(1) }
}
let fn = new Fn();
fn.then();
// stdout 和console一样(stderr stdin)
process.stdout.write('1');
console.log(1);

//node的宏任务和微任务
// 微任务 
// then  nextTick ( messageChannel mutationObersve)
// nextTick 会比 then快
Promise.resolve().then(function () {
    console.log('then')
})
process.nextTick(function () {
    console.log('nextTick')
});

// 宏任务 
// setTimeout setInterval setImmediate

// 浏览器中 先执行当前栈 执行完走微任务 走事件队列里的内容（拿出一个）放到栈里执行
// 在去执行微任务 
setTimeout(function () {
    console.log('setTimeout1')
    Promise.resolve().then(function () {
        console.log('promise')
    });
})
setTimeout(function () {
    console.log('setTimeout2');
});

// nextTick 和 then 都是在 阶段转化时才会调用
process.nextTick(function () {
    console.log('nextTick')
});
setImmediate(function () {
    console.log('immediate')
});

// timeout immediate 两个谁先执行不一定 取决于node的执行时间
setTimeout(function () {
    console.log('timeout');
})
setImmediate(function () {
    console.log('immediate')
});

// 但是加上i/o文件操作（宏任务）以后就会先执行setImmediate
let fs = require('fs');
fs.readFile('./1.log', function () {
    console.log('fs');
    setTimeout(function () {
        console.log('timeout');
    })
    setImmediate(function () {
        console.log('setImmediate')
    })
});

//最后的例子
setImmediate(function () {
    console.log(1);
    process.nextTick(function () {
        console.log(4)
    })
})
process.nextTick(function () {
    console.log(2)
    setImmediate(function () {
        console.log(3);
    })
})
// 2 1 3 4

//模块引入的小坑
module.exports = 'xxx'  //可以使用
exports = 'xxx'           //不可以使用
//但是可以
exports.x = 'xxx'
//path内部方法  （文件路径处理）
//path.join(xxx,xxx)合并路径
//path.resolve()


//util内部工具方法

//util.promisify()  相当于blueBird 将方法promise化
let fs = require('fs');
let { promisify } = require('util');
let read = promisify(fs.readFile);
read('./1.txt', 'utf8').then(function (data) {
    console.log(data);
});
//回顾bluebird
let bluebird = require('bluebird');
let fs = require('fs');
let read = bluebird.promisify(fs.readFile);
read('./1.txt', 'utf8').then(function (data) {
    console.log(data);
});

//util.inspect() 没什么实际用处 等价于console.dir();
let util = require('util');
console.log(util.inspect(Array.prototype, { showHidden: true }));

//util.inherits() 继承 只继承共有属性
let util = require('util');
function A() { }
A.prototype.fn = function () {
    console.log(1);
}
function B() { }
util.inherits(A, B);
let b = new A();
b.fn();
//第一种继承共有属性的方法
A.prototype.__proto = B.prototype;
//第二种
A.prototype = Object.create(B.prototype);
//第三种
Object.setPrototypeOf(A.prototype, b.prototype);
//inherite用的第三种

//events 发布订阅
//小例子
let fs = require('fs');
let path = require('path');
let EventEmitter = require('events');
let events = new EventEmitter();
events.on('getData', function (data) {
    console.log(data);
});
fs.readFile('1.txt', 'utf8', function (err, data) {
    events.emit('getData', data);
});
fs.readFile('2.txt', 'utf8', function (err, data) {
    events.emit('getData', data);
});
//还有很多暂时搁置



//截取bom头 在fs.readFileSync()方法里 UTF8格式的文件在字节标识需要删除 EF BB BF  
let fs = require('fs');
function stripBOM(content) {
    if (Buffer.isBuffer(content)) {
        if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
            return content.slice(3);
        }
        return content;
    } else {
        if (content.charCodeAt(0) === oxFEFF) {
            content = content.slice(3);
        }
        return content;
    }
}
let result = fs.readFileSync('./1.txt');
result = stripBOM(result);
console.log(result.toString());

// iconv-lite 解析其他编码的外部方法
let iconv = require('iconv-lite');
let fs = require('fs');
let result = fs.readFileSync('./2.txt');
result = iconv.decode(result, 'gbk');
console.log(result.toString());

//Buffer的乱码问题
let buffer = Buffer.from('珠峰培训');
let buff1 = buffer.slice(0, 5);
let buff2 = buffer.slice(5);
console.log(buff1.toString());
console.log(buff2.toString());
//string_decoder模块解决
let buffer = Buffer.from('珠峰培训');
let buff1 = buffer.slice(0, 5);
let buff2 = buffer.slice(5);
let { StringDecoder } = require('string_decoder');
let sd = new StringDecoder();
console.log(sd.write(buff1).toString());
console.log(sd.write(buff2).toString());
// 模块来解决输出问题 string_decoder 我不识别的不输出 先攒着

// fs模块 fileSystem 文件系统
//同步性能低，会阻塞线程，能用异步就用异步

//fs.readFile() fs.readFileSync() 读取文件
let fs = require('fs');
fs.readFile('./1.txt', {
    encoding: null,  //读取文件时候的编码,默认是null,代表的是二进制
    flag: 'r',       //条件 r读文件 w写文件 a追加写入
}, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

//fs.writeFile() 写入文件
let fs = require('fs');
fs.writeFile('./3.txt', 'aaa', {
    encoding: null,      //默认null(二进制)
    mode: 0o666          //默认权限
}, function (err) {
    console.log(err);
});
// d                    rwx              rwx             rwx       
// -                    421              421             421
//文件夹为d文件为-       文件所有者权限    文件所属组权限   其他用户

// fs.copyFile() 拷贝文件(node8.5+)
//小例子（不方便）
let fs = require('fs');
function copy(source, target) {
    fs.readFile(source, 'utf8', function (err, data) {
        if (err) return console.log(err);
        fs.writeFile(target, data, function (err) {
            if (err) return console.log(err);
        });
    });
}
copy('./3.txt', './4.txt');
//用法
let fs = require('fs');
fs.copyFile('./1.txt', './5.txt', function (err) {
    if (err) return console.log(err);
    console.log(111);
});

//fs.open() 打开文件
//flag参数含义
//r 读取文件
//r+ 读取并写入（替换） 
//rs 同步读取文件并忽略缓存
//w 写入文件，不存在则创建，存在则清空
//wx 排他写入文件
//w+ 读取并写入文件，不存在则创建，存在则清空
//wx+ 和w+类似，排他方式打开
//a 追加写入
//ax 与a类似，排他方式写入
//a+ 读取并追加写入，不存在则创建
//ax+ 作用与a+类似，但是以排他方式打开文件
let fs = require('fs');
// fd(file descriptor) 文件描述符 代表对当前文件的描述 从3开始
// process.stdout.write(); // 标准输出  1
// process.stderr.write();// 错误输出 2

// 读
let buffer = Buffer.alloc(3);
fs.open('./3.txt', 'r', 0o666, function (err, fd) {
    // offset表示的是 buffer从那个开始存储
    // length就是一次想读几个,length不能大于buffer的长度
    // postion 代表的是文件的读取位置，默认可以写null 当前位置从0开始
    fs.read(fd, buffer, 0, 3, null, function (err, bytesRead) {
        //bytesRead读到的个数
        console.log(buffer);
    })
});

//写
// 如果flag是a 那你写的position参数就不生效了
let fs = require('fs');
let buffer = Buffer.from('0123456789');
fs.open('./3.txt', 'r+', 0o666, function (err, fd) {
    fs.write(fd, buffer, 0, 5, null, function (err, byteWritten) {
        console.log(byteWritten);
    });
});

//读写组合
let fs = require('fs');
function copy(source, target) {
    let size = 3;
    let buffer = Buffer.alloc(3);
    fs.open(source, 'r', function (err, rfd) {
        fs.open(target, 'w', function (err, wfd) {
            function next() {
                fs.read(rfd, buffer, 0, size, null, function (err, bytesRead) {
                    if (bytesRead > 0) {
                        fs.write(wfd, buffer, 0, bytesRead, null, function (err, bytesWritten) {
                            next();
                        });
                    }else{
                        fs.close(rfd,function(){});
                        fs.fsync(wfd,function(){
                            fs.close(wfd,function(){
                                console.log('关闭','拷贝成功');
                            });
                        });
                    }
                })
            }
            next();
        })
    });
}
copy('./3.txt', './4.txt');

//fs.fsync()将缓存区数据强制写入文件
//fs.close()关闭文件

// 文件打开是需要关闭的
let fs = require('fs');
fs.open('./3.txt','w',function(err,fd){
    fs.write(fd,Buffer.from('刘洋志'),0,9,0,function(err,byteswritten){
        // 当write方法触发了回调函数 并不是真正的文件背写入了，先把内容写入到缓存区
        // 所以现在还不能关闭，要先将缓存区的内容写如后，再关闭文件
        fs.fsync(fd,function(){
            fs.close(fd,function(){
                console.log('关闭');
            });
        })
    });
});
setTimeout(function(){
    fs.open('./3.txt','r',function(err,fd){
        console.log(fd);
    });
},1000);



