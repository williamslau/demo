//util是一个工具方法

//util.inherits()

//util.promisify();

let fs=require('fs');
let {promisify} = require('util');
let path =require('path');
let read=promisify(fs.readFile);
read(path.resolve(__dirname,'./1.txt'),'utf8').then(function(data){
    console.log(data);
});
