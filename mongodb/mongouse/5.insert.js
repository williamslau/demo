var db = connect('school');
var stus = [
    { province: '北京', home: '北京', age: 1 },
    { province: '北京', home: '北京', age: 2 },
    { province: '北京', home: '北京', age: 3 },
    { province: '广东', home: '广州', age: 1 },
    { province: '广东', home: '佛山', age: 2 },
    { province: '广东', home: '东莞', age: 3 },
];
db.b.insert(stus);