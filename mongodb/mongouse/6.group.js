
db.runCommand({
    group: {
        ns: 'b',
        key: { province: 1,home:1 },
        query: { age: { $gt: 1 } },
        initial: { total: 0 },
        $reduce: function (doc, initial) {
            initial.total += doc.age;
        }
    }
});
db.runCommand({
    group:{
            ns:'b',
            key:{home:true},
            condition:{age:{$gt:1}},
            initial:{total:0},
            $reduce:function(doc,result){
                  result.total += doc.age;   
            },
            finalize:function(result){
                result.desc = '本城市的总年龄为'+result.total;
            }
    }
});