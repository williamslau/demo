// 引入umongoose
let mongoose = require('mongoose');
// 链接数据库
let connection = mongoose.createConnection('mongodb://localhost/william');

connection.on('error', function (err) {
    console.error('数据库链接失败', err);
})
connection.on('open', function () {
    console.log('数据库链接成功');
});

// 创建数据哭的骨架模型 Schema
let PersonSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

// 创建modle 通过链接创建模型，模型会创建数据库，可以操作数据库
// 默认名字传入的就是模型的名称
let Person = connection.model('Person', PersonSchema);


// 通过modle创建实体
// 如果对象中的字段在Schema中没有定义，则会被忽略掉
// 如果对象中少于Schema中定义的字段，缺少的字段则不会被保存
// 如果字段类型不匹配则报错
// modle是模型，他的操作针对的是整个模型
// let person = new Person({ name: 'william', age: 11 });
// person.save((err, doc) => {
//     console.log(err);   // err为null表示没有错误
//     console.log(doc);   // 保存成功之后的文档
// });
// let person = new Person();
// let persons = [];
// for (let i = 1; i <= 10; i++) {
//     persons.push({ name: 'william' + i, age: i });
// }
// create 用于插入文档，类似于原生的insert
// Person.create(persons,function(err,doce){
//     console.log(err);
//     console.log(doce);
// });
// find用于查询文档，类似原生的find,返回值永远是一个数组
// Person.find({age:3},{name:1,_id:0},function(err,doce){
//     console.log(err);
//     console.log(doce);
// });
// 即使传入整个文档，也不会直接覆盖原文档，也是按字段覆盖
// {multi:true} 更新多条
// Person.update({ age: 1 }, { age: 100 },{multi:true}, function (err, result) {
//     console.log(err);
//     console.log(result);
// });
// $set直接指定更新后的值
// $inc在原基础上累加
// Person.update({ age: 1 }, {$inc:{age:100}},{multi:true}, function (err, result) {
//     console.log(err);
//     console.log(result);
// });
// Person.find({},function(err,doce){
//     console.log(err);
//     console.log(doce);
// });

// remove会删除所有匹配的文档
// {jusOne:true} 只删除一条
// Person.remove({ age: 100 }, function (err, result) {
//     console.log(err);
//     console.log(result);
// });



// 高级查询
// 查找一条
// Person.findOne({},function(err,doc){
//     console.log(err);
//     console.log(doc);
// });
// id查找 原生的不能用字符串，这里能用
// Person.findById({_id:'5b10fbba614dd70374da57fe'},function(err,doc){
//     console.log(err);
//     console.log(doc);
// });

// 比较运算符
// $gt 大于
// $gte 大于等于
// $lt 小于
// $lte 小于等于
// Person.find({ age: { $gt: 1, $lt: 5 } }, function (err, docs) {
//     console.log(docs);
// });
// $or 或者
// Person.find({ $or: [{ age: { $lt: 3 } }, { age: { $gt: 9 } }] }, { age: 1, _id: 0 }, function (err, docs) {
//     console.log(err);
//     console.log(docs);
// })
Person.find({ age: { $ne: 3 } }, function (err, docs) {
    console.log(err);
    console.log(docs);
});
// 是否包含这个字段
Person.find({ home: { $exists: true } }, function (err, docs) {
    console.log(docs);
});






