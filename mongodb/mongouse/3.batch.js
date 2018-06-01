var db = connect('school');
var start = Date.now();
var seus=[];
for (var i = 1; i <= 10; i++) {
    seus.push({ name: 'williamlau'+i, age: i });
}
db.a.insert(seus);
print('cost ' + (Date.now() - start) / 1000 + ' s');