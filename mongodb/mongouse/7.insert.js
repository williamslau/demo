var start = Date.now();
var stus=[];
for(var i=0; i<1000000; i++){
    stus.push({name:'zfpx',age:i,random:Math.random()});
}
db.students.insert(stus);
print('cost ' + (Date.now() - start) / 1000 + ' s');