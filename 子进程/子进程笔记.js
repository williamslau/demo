// node是单线程语言，但是集成了子进程模块 child_process
// 可以创建一个进程为我们服务，不会影响node的事件环
// 所以node是一门多进程语言
// 多核cpu如果node只开一个进程，就只会占用一个cpu
// node里一个进程只有一个线程
// 集群
// 查看服务器cpu个数
let os = require('os');
console.log(os.cpus().length);

// 创建一个子进程，复杂在进程之间的通信
// child_process 的方法有
// spawn 生产
// fork 叉子
// exec 执行
// execFile 执行文件

// spawn 生产
let { spawn } = require('child_process');
let path = require('path');
// spawn(命令,[参数],{cwd:工作目录}) node aa.js
let child = spawn('node', ['1.test.js', 'a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro'),       //current working directory
    // stdio:'inherit',            // 继承父进程    默认stdio:['pipe'] 管道类型
    // stdio:[process.stdin,process.stdout,process.stderr],
    //stdio:[0,1,2],
});
// 
// 主进程里有三个东西
// process.stdin    0   标准输入
// process.stdout   1   标准输出
// process.stderr   2   错误输出
child.stdout.on('data', function (data) {
    console.log(data.toString());
});
child.on('exit', function () {     // 进程退出（进程执行完了）
    console.log('exit');
});

child.on('close', function () {    // 进程关闭，会在exit之后执行
    console.log('close');
});

child.on('error', function (err) {      // 错误
    console.log(err);
});

// 建立三个进程，（主进程）创建两个进程
// 将第一个进程中的参数传入第二个进程中
// 再在第二个进程中写入到文件中
let { spawn } = require('child_process');
let path = require('path');
let child2 = spawn('node', ['2.test.js', 'a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro')
});
let child3 = spawn('node', ['3.test.js', 'a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro')
});

child2.stdout.on('data', function (data) {
    child3.stdout.write(data);
});


// 上述方案比较啰嗦，好方案是创建进程之间的通信
// ipc inter-Process_Communication
let { spawn } = require('child_process');
let path = require('path');
let child = spawn('node', ['ipc.js'], {
    cwd: path.join(__dirname, 'pro'),
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});
child.send({ name: 'willianlau' });
child.on('message', function (data) {
    console.log(data);
    child.kill(); // 杀死进程
});
// ignore 不要子进程数据
// pipe 建立管道
// null
// ipc  支持ipc通信

// 现在是主进程控制，还可以子进程控制自己关闭
// detach 主进程放弃控制权
// unref() 将主进程关掉
let { spawn } = require('child_process');
let path = require('path');
let fd = require('fs').openSync(path.join(__dirname, '100.txt'), 'w');
let child = spawn('node', ['detach.js'], {
    cwd: path.join(__dirname, 'pro'),
    stdio: ['ignore', fd, 'ignore'],    // 会自动将描述符包装成可写流
    detached: true,
});
child.unref();

// fork 默认支持ipc的方法
let { fork } = require('child_process');
let path = require('path');
let child = fork('fork.js', ['a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro'),
    silent: false   // 是否打印子进程的cosole 这句话的意思就是 ['ignore','ignore','ignore','ipc']
});
child.send('hello');

// 用spawn模拟fork
let { spawn } = require('child_process');
let path = require('path');
function fork(modulePath, args, options = {}) {
    if (options.silent) {
        options.stdio = ['ignore', 'ignore', 'ignore', 'ipc'];
    } else {
        options.stdio = [0, 1, 2, 'ipc']
    }
    return spawn('node', [modulePath, ...args], options);
}
let child = fork('fork.js', ['a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro'),
    silent: false
});
child.send('hello');



// 配合http
// 使用client.js测试
let { fork } = require('child_process');
let path = require('path');
let http = require('http');
let child = fork('http.js', {
    cwd: path.join(__dirname, 'pro')
});
let server=http.createServer(function(req,res){
    res.end('父进程接收数据请求');
});
server.listen(3000);
child.send('hello',server);
