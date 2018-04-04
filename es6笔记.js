// es6 也叫se2015
// babel 可以将es6转化成es5
// 随着网络的发展，慢慢的也就不需要做兼容处理了

// 常用的api
// 1.let&&const

// var 有作用域的问题，经常会污染全局作用域
// let const 声明变量不会声明到window上(在浏览器环境中)
// 作用于：函数作用域 全局作用域
// {} 可以表示一个作用域
var a = 1;
console.log(window.a);
// 浏览器运行结果
// 1
let a = 1;
const a = 1;
console.log(window.a);
// 浏览器运行结果
// undefined

// 作用域问题 “暂存死区”
// 用let声明的变量会绑定到当前的作用域下，
let a = 1;
if (true) {
    console.log(a);
    let a = 2;
}
// 运行结果 a is not defined （未定义）

// var 的声明问题 可能会出现重复声明的问题（同一个作用于下不能背重复声明）
var a = 1;
var a = 2;
console.log(a);
// 运行结果
// 2
let a = 1;
let a = 2;
console.log(a);
// const a = 1;
// const a = 2;
// console.log(a);
// 运行结果
// 报错Identifier 'a' has already been declared（变量不能被重复声明）

// var 会变量提升（预解释）
// 用var声明的变量会预解释，但不会赋值
// 函数即会预解释又会赋值
console.log(a);
var a = 1;
// 运行结果
// undefined
console.log(a);
function a() { }
// 运行结果
// [Function: a]

// 循环绑定事件 常用在for(let i=0; i<3; i++){}
for (var i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i);
    });
}
// 运行结果
// 3 3 3
for (var i = 0; i < 3; i++) {
    (function (i) {
        setTimeout(function () {
            console.log(i);
        });
    })(i)
}
// 运行结果
// 0 1 2

for (let i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i);
    });
}
// 运行结果
// 0 1 2

// const 常量，不能被更改
// 一般常量都会用大写来表示
const a = 1;
a = 2;
// 运行结果
// Assignment to constant variable.

// 引用地址不变就可以
const a = { name: 1 };
a.name = 2
console.log(a.name);
// 运行结果
// 2



// deconstruction 解构
// 等号左边和等号右边结构相等 就可以结构
// 解构叫即声明又赋值

// 数组解构
let [, b, c] = [1, 2, 3]; // 数组的key要对应上,如果不想要可以省略空出来
console.log(b);
console.log(c);
// 运行结果
// 1 2 3

// 对象解构 
// 如果key没有对应会报undefuned 还可以赋默认值(i = 3)和更改名字(name : m)
let { n, age, name: m, i = 3 } = { name: 1, age: 2 }
console.log(n, age, m, i);
// 运行结果
// undefined 2 1 3

// 混合用法
let [{ name }, b, [c, d]] = [{ name: 1 }, 2, [3, 4]];
console.log(name, b, c, d);
// 运行结果
// 1 2 3 4

// 应用
ajax({
    url: '/user',
    method: 'get',
});
function ajax({ url = new Error(), method = 'get' }) { }



// 模板字符串
// 普通字符串 '' ""
// es6 `` 可以放变量 如果要套`需要转义 \`
let name = 'william';
let age = 9;
let str = `我叫${name},今年${age}岁`;
console.log(str);
// 运行结果
// 我叫william,今年9岁

// 模板字符串封装
let name = 'william';
let age = 9;
let str = '我叫${name},今年${age}岁';
str = str.replace(/\$\{([^}]+)\}/g, function () {
    return eval(arguments[1])
});
console.log(str);

// 模板字符串可以换行
let arr = ['williamlau', '大志'];
let newArr = arr.map(function (item) {
    return (
        `<il>
            <span>${item}</span>
        </li>`
    );
});
let str = `
    <ul>
        ${newArr.join()}
    </ul>
`;
console.log(str);

// 带标签的模板字符串 可以根据自己定义的方法对字符串进行操作
let name = 'william';
let age = 9;
function tag(arrs, ...args) {
    let str = '';
    for (let i = 0; i < args.length; i++) {
        str += (`${arrs[i]}(${args[i]})`)
    }
    str += arrs[arrs.length - 1]
    return str;
}
let newStr = tag`我叫${name},今年${age}岁`;
console.log(newStr);
// 运行结果
// 我叫(william),今年(9)岁

// includes 是否包含
let str = 'abcdefg';
console.log(str.indexOf('1'));
console.log(str.includes('1'));
// 运行结果
// -1
// false

// endsWith 是否以XX结尾
let str = 'abcdefg';
console.log(str.endsWith('g'));
// 运行结果
// true

// startsWith 是否以XX开头
let str = 'abcdefg';
console.log(str.endsWith('a'));
// 运行结果
// true

// padStart 向前补零 padEnd 向后补零
let date = new Date();
let str = `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, 0)}月${date.getDate().toString().padEnd(2, 0)}`;
console.log(str);
// 运行结果
// 2018年04月40



// 函数

// 函数的默认参数
function fn(str = '$') {
    console.log(str);
};
fn();
// 运行结果
// $

// 箭头函数 没有function关键字，函数参数和函数体用箭头连接在一起
// 箭头函数中没有arguments,没有this指向（this穿透）谁调用this指向的就是谁
let a = (str) => {
    console.log(str);
}
a('hello');
// 运行结果
// hello
// 如果参数只有一个，可以省略小括号
let a = str => {
    console.log(str);
}
a('hello');
// 运行结果
// hello

// 如果有返回值return,可以省略大括号，箭头后面就是返回值
let a = str => console.log(str);
a('hello');
// 运行结果
// hello

// this指向问题
let obj = {
    fn: function () {
        console.log(this);
    }
}
let Fn = obj.fn;
Fn();
// 浏览器运行结果
// Window {stop: function, open: function, alert: function, confirm: function, prompt: function…}

let obj = {
    fn: function () {
        console.log(this);
    }
}
obj.fn();
// 浏览器运行结果
// Object {fn: function}
// setTimeout的this错乱 this会指向调用setTimeout的window
let age = 2;
let obj = {
    age: 1,
    fn: function () {
        setTimeout(function () {
            console.log(this.age);
        });
    }
}
obj.fn();
// 浏览器运行结果
// undefined
// let不会挂在全局作用域windows上
// 如果使用箭头函数this就会指向调用他的obj
let age = 2;
let obj = {
    age: 1,
    fn: function () {
        setTimeout(() => {
            console.log(this.age);
        });
    }
}
obj.fn();
// 浏览器运行结果
// 1

// 对象中没有作用域
let age = 2;
let obj = {
    age: 1,
    fn: () => {
        setTimeout(() => {
            console.log(this.age);
        });
    }
}
obj.fn();
// 浏览器运行结果
// undefined


// 剩余运算符&展开运算符 
// ...剩余运算符 只能在函数的最后一个参数使用
function fn(str, ...args) {
    console.log(str);
    console.log(args);
}
fn('$', 1, 2, 3, 4);
// 运行结果
// $
// [ 1, 2, 3, 4 ]

// ...展开运算符
let arr=[1,2,3];
console.log(...arr);
// 运行结果
// 1 2 3
// 用法对比
// apply 可以改变this指向， 可以传参
let arr=[5,7,31,2,3];
console.log(Math.min.apply(Math,arr));
console.log(Math.min(...arr));
// 运行结果
// 2


// 可以合并对象和数组
// 数组的展开
let arr = [];
let arr1 = [1,2];
let arr2 = [3,4];
let newArr  = arr.concat(arr1,arr2);
//or
let arr1 = [1,2];
let arr2 = [3,4];
let newArr = [...arr1,...arr2];
console.log(newArr);
// 运行结果
// [ 1, 2, 3, 4 ]

// 对象的展开
let school = {name:'zfpx',age:9};
let me = {name:'jw',address:'回龙观'}

let obj = {...school,...me};
console.log(obj);
// 运行结果
// { name: 'jw', age: 9, address: '回龙观' }

// assign和展开运算符可以算是等价的
let school = {name:'zfpx',age:9};
let me = {name:'jw',address:'回龙观'}
let result = Object.assign(school,me);
console.log(result); 


