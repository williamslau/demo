let http=require('http');
http.createServer(function(req,res){
    res.end('hello');
}).listen(5000);