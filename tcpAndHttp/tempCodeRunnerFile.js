
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


