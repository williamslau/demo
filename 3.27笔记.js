//可读流 flowing
//可写流 fs.createWriteStream()
//pipe

//目前学的只对文件操作


//可读流分为两种，一种是暂停模式，一种是流动模式

let fs = require('fs');
let path = require('path');

let rs = fs.createReadStream('./4.txt', {
    flags: 'r',
    autoClose: true,
    encoding: 'utf8',
    start: 0,
    end: 6,
    highWaterMark: 5,
});
//默认先蓄满
rs.on('readable', function () {
    let result = rs.read(2);
    console.log(rs._readableState.length);
    setTimeout(function(){
        console.log(rs._readableState.length);
    },1000);
});