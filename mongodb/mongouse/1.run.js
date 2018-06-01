var command = {
    // 要操作的集合
    findAndModify: 'students',
    // 查询的条件，指定操作的范围
    query: { name: 'williamlau' },
    // 指定如何更新
    update: { $set: { age: 100 } },
    // 指定返回的对象
    fields: { age: true, _id: false },
    // 按照age字段进行排序
    sort: { age: 1 },
    // true 返回更新后的文档，false 返回更新前的文档
    new: true,
}
var db = connect('school');
var result = db.runCommand(command);
printjson(result);