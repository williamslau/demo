
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