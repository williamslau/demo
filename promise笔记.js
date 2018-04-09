// 异步的发展流程

// callback promise generator+co async/await

// callback
// 高阶函数
// 函数可以作为参数或者函数还可以作为返回值

// 判断数据类型
// 普通函数写法
function isType(type, content) {
    return Object.prototype.toString.call(content) === `[object ${type}]`;
}

console.log(isType('String', 'aaaa'));

// 偏函数
// 函数参数可以先预置进去，这样的函数叫做偏函数
// 可以批量生成函数
function isType(type) {
    return function (content) {
        return Object.prototype.toString.call(content) === `[object ${type}]`;
    }
}
let isString = isType('String');
let isNumber = isType('Number');
console.log(isString('aaa'));
console.log(isNumber(11));

// 预制函数
function after(times, callback) {
    return function () {
        if (--times === 0) {
            callback();
        }
    }
}
let eat = after(3, function () {
    console.log('完成');
});
eat();
eat();
eat();

// 高阶函数callback
let fs = require('fs');
function out(times, callback) {
    let arr = [];
    return function (data) {
        arr.push(data);
        if (arr.length === times) {
            callback();
        }
    }
}
let last = out(2, function (data) {
    console.log(arr);
});
fs.readFile('./1.txt', 'utf8', function (err, data) {
    last(data);
});
fs.readFile('./2.txt', 'utf8', function (err, data) {
    last(data);
});



// promise(承诺) 
// 默认情况下是padding，执行后成功会执行resolve,失败会执行reject。
// promise可以简化的操作就是回调地狱

// 基础用法
let promise = new Promise(function (resolve, reject) {
    console.log('padding');
    resolve('成功');
    //reject('失败');
});
promise.then(function (data) {
    console.log('data', data);
}, function (err) {
    console.log('err', err);
});
// 运行结果
// padding
// data 成功

// 配合readFile使用
// 如果返回普通值，会将这个值作为下一个then的成功回掉
// 如果返回值是个promise ,会将promise的结果返回到下一个promise中
// 如果有错误，会统一走尾部的catch方法
let fs = require('fs');
function read(url) {
    return new Promise(function (resolve, reject) {
        fs.readFile(url, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}
read('./1.txt').then(function (data) {
    console.log(data);
    return read(data);
}).then(function (data) {
    console.log(data);
}).catch(function (err) {
    console.log(err);
});;
// 运行结果
// 2.txt
// 文件内容

// Promise.all 一起读两个函数
// err 如果有一个失败所有的都失败
let fs = require('fs');
function read(url) {
    return new Promise(function (resolve, reject) {
        fs.readFile(url, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}
Promise.all([read('1.txt'), read('2.txt')]).then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
});

// promise的静态方法
Promise.resolve([1, 2, 3]).then(function (data) {
    console.log(data);
});

Promise.reject([1, 2, 3]).then(null, function (err) {
    console.log('err', err)
});


// 封装promise
function Promise(executor) {    // executor是一个执行函数
    let self = this;
    self.status = 'pending';
    self.value = undefined;     // 默认成功的值
    self.reason = undefined;    // 默认失败的值
    self.onResolvedCallbacks = [];  // 存放成功的回掉
    self.onRejectedCallbacks = [];  // 存放失败的回掉
    function resolve(value) {   // 成功状态
        self.status = 'resolved';
        self.value = value;
        self.onResolvedCallbacks.forEach(function (fn) {
            fn();
        });
    }
    function reject(reason) {   // 失败状态
        self.status = 'rejected';
        self.reason = reason;
        self.onRejectedCallbacks.forEach(function (fn) {
            fn();
        });
    }
    try {
        executor(resolve, reject);
    } catch (e) {   // 处理异常状态,传给reject
        reject(e);
    }
};
function resolvePromise(p2, x, resolve, reject) {
    //1.处理乱写
    //2.判断返回的是不是自己
    if (p2 === x) {
        reject(new typeError('循环引用'));
    }
    //判断x是不是params(判断x是不是object)
    let called; //表示是否调用过成功或者失败
    if (x !== null || typeof x === 'object' || typeof x === 'function') {
        //判断promise只要判断对象中是否有then方法
        try {
            let then = x.then;
            if (typeof then === 'function') { //then返回的可能是{then:xxx}，判断then是不是一个函数
                then.call(x, function (y) { //成功了以后可能会执行resolve(new Promise())用递归来解决
                    if (called) return;
                    called = true;
                    resolvePromise(p2, y, resolve, reject);
                }, function (err) {
                    if (called) return;
                    called = true;
                    reject(err);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {  //esle普通值
        resolve(x);
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {  //判断onFulfilled是不是一个函数，不是给他个函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
        return value;
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function (err) {
        throw err;
    }
    let self = this;
    let promise2;           //实现链式操作
    if (self.status === 'resolved') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        });
    }
    if (self.status === 'rejected') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        });
    }
    if (self.status === 'pending') {
        promise2 = new Promise(function (resolve, reject) {
            self.onResolvedCallbacks.push(function () {
                setTimeout(function () {
                    try {
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            });
            self.onRejectedCallbacks.push(function () {
                setTimeout(function () {
                    try {
                        let x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            });
        });
    }
    return promise2;
}
let p = new Promise(function (resolve, reject) {
    resolve('成功')
});
p.then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
});
// 运行结果
// 成功




// generator (迭代器)
// 配合promise
// generator也是一个函数，和普通函数不一样，可以有暂停的功能
// 迭代器就是有next方法的，没次调用后都会返回一个done和一个叫value的属性

// 迭代器的实现原理
function read(arrs) {
    let index = 0; // 默认迭代第一项
    let len = arrs.length;
    return {
        next() {
            return { value: arrs[index], done: index++ === len ? true : false }
        }
    }
}
let it = read(['react', 'vue', 'angular']);
console.log(it.next()); // {done:false,value:'react'}
console.log(it.next()); // {done:false,value:'vue'}
console.log(it.next()); // {done:false,value:'angular'}
console.log(it.next()); // {done:true,value:undefined}
// 运行结果
// { value: 'react', done: false }
// { value: 'vue', done: false }
// { value: 'angular', done: false }
// { value: undefined, done: true }

// 配合do while
function read(arrs) {
    let index = 0; // 默认迭代第一项
    let len = arrs.length;
    return {
        next() {
            return { value: arrs[index], done: index++ === len ? true : false }
        }
    }
}
let it = read(['react', 'vue', 'angular']);
let flag = true
do {
    let { done, value } = it.next();
    flag = done;
    console.log(value);
} while (!flag)
//运行结果
// react
// vue
// angular
// undefined

// generator 用法
// 可以配置yield 
function* read(arrs) {
    yield arrs[0];
    yield arrs[1];
    yield arrs[2];
}
let it = read(['react', 'vue', 'angular']);
let flag = true
do {
    let { done, value } = it.next();
    flag = done;
    console.log(value);
} while (!flag);