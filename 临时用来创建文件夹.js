
//异步创建文件夹
//如果是异步的永远不能用for循环，要用next()函数自调用，递归来替代
let fs = require('fs');
function mkdirSync(dir, callback) {
    let paths = dir.split('/');
    function next(index) {
        if (index > paths.length) return callback();
        let newPath = paths.slice(0, index).join('/');
        fs.access(newPath, function (err) {
            if (err) {    //如果文件不存在就创建这个文件
                fs.mkdir(newPath, function (err) {
                    next(++index);
                });
            } else {
                next(++index);  //文件夹存在就判断下一个文件夹，递归
            }
        });
    }
    next(1);
}
mkdirSync('a/b/c/d/e', function () {
    console.log('完成');
});