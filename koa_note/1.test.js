let Koa = require('./koa/application');
let app = new Koa();
app.listen(3000);
// app.use((req, res) => {
//     res.end('hello');
// });

app.use((ctx) => {
    ctx.response.body = '1';
    ctx.body = '1';
    console.log(ctx.request.query);
    console.log(ctx.query);         // 用contex.js做代理 代理request和reponse
    console.log(ctx.response.body);
    console.log(ctx.body);
});