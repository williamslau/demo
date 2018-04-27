
// koa是一个类，类上面有两个方法，一个是use,一个是listen

// koa自己封装的require，response属性
// ctx.request
// ctx.response
// 原生的req,res属性
// ctx.req
// ctx.res
let Koa = require('koa');
let app = new Koa();
app.listen(3000);
app.use((ctx, next) => {
    ctx.res.write('hello');
    ctx.res.end('world');
});

// koa自己封装的
// koa将原生的req对象，都代理到ctx上了
// cex只是用来代理的
let Koa = require('koa');
let app = new Koa();
app.listen(3000);
app.use((ctx, next) => {
    console.log(ctx.url, ctx.request.url); // url地址   /index.html?a=1
    console.log(ctx.method, ctx.request.method); // 方法 GET/POST
    console.log(ctx.query, ctx.request.query); // 查询问号后面的值 { a: '1' } 
    console.log(ctx.path, ctx.request.path); // 路径/地址 /index.html
    console.log(ctx.querystring);           // 查询问号后面的值 a=1
    ctx.body = 'hello';         // 致以最后一次为准
});


// 自己封装koa见koa文件夹



// koa是洋葱模型，一层套一层
// 只要调用next或者异步函数的封装就加上await 就加await,防止下一个中间件中有异步
// 如果不需要继续可以return next() 这样在use中return next()下面的代码就不会执行了
let Koa = require('koa');
let app = new Koa();

app.listen(8080);
function log(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log('ok');
            resolve();
        },3000);
    });
}
app.use(async (ctx, next) => {
    console.log(1);
    await next();
    console.log(6);
});
app.use(async (ctx, next) => {
    console.log(2);
    await log();
    next();
    console.log(5);
});
app.use(async (ctx, next) => {
    console.log(3);
    next();
    console.log(4);
});




// next原理 合并三个函数的方法
let fn1 = (ctx, next) => {
    console.log(1);
    next();
    console.log(6);
}
let fn2 = (ctx, next) => {
    console.log(2);
    next();
    console.log(5);
}
let fn3 = (ctx, next) => {
    console.log(3);
    next();
    console.log(4);
}
let fns = [fn1, fn2, fn3];
function dispatch(index) {
    let middle = fns[index];
    if (fns.length === index) return function () { };
    middle({}, () => dispatch(index + 1))
}
dispatch(0);