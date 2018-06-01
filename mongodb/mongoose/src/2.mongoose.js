
let mongoose = require('mongoose');
let connection = mongoose.createConnection('mongodb://localhost/william');

connection.on('error', function (err) {
    console.error('数据库链接失败', err);
})
connection.on('open', function () {
    console.log('数据库链接成功');
});

let PersonSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

let a = connection.model('Person', PersonSchema);
let pageNum = 2;
let pageSize = 3;
// skip 跳过多少条
// limit 返回多少条
// sort 排序
// exec执行
// a.find()
//     .skip((pageNum - 1) * pageSize)
//     .limit(pageNum)
//     .sort({age:1})
//     .exec(function(err,docs){
//         console.log(docs);
//     });
a.find({}, null, { skip: ((pageNum - 1) * pageSize), limit: pageNum, sort: { age: 1 } }, function (err, docs) {
    console.log(docs);
});

// Not SQL
// Not Only SQL 不仅仅是SQL语句数据库

// 关联型数据库
