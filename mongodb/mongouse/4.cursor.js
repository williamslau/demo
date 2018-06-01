var db = connect('school');

// 返回的是一个游标，指向结果集的指针
var cursor = db.students.find();
// while (cursor.hasNext()) {
//     var recod = cursor.next();
//     printjson(recod);
// }
cursor.forEach(function (item) {
    printjson(item)
});