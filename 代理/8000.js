let http=require('http');
http.createServer(function(req,res){
    res.end('hello');
}).listen(8000);