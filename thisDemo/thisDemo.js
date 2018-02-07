/**
 * Created by chengkang on 2018/1/29.
 */
//js中返回值随便返回,里面的this语义也千差万别
//在非箭头函数下， this 指向调用其所在函数的对象，而且是离谁近就是指向谁 *
//(此对于常规对象，原型链， getter & setter等都适用）；
//1 构造函数下，this与被创建的新对象绑定；
//2 DOM事件，this指向触发事件的元素；
//3 内联事件分两种情况，bind绑定， call & apply 方法等， 容以下一步一步讨论。

//一:在全局环境下，this 始终指向全局对象（window）, 无论是否严格模式；
console.log("global:"+(this.document === document)); // true

// 在浏览器中，全局对象为 window 对象：
console.log("global:"+(this === window)); // true

this.a = 37;
console.log("global:"+window.a+"\n"); // 37

//二:函数上下文调用 非严格模式下，this 的值默认为全局对象window,严格模式， this的值为undefined
function f1(){
    return this;
}

console.log("un strict:"+(f1() === window)); // 非严格模式 true

function f2(){
    "use strict"; // 这里是严格模式
    return this;
}

console.log("strict:"+(f2() === undefined)+"\n"); // 严格模式 true

//三 对象中的this,对象内部方法的this指向调用这些方法的对象
//1 函数的定义位置不影响其this指向，this指向只和调用函数的对象有关。
//2 多层嵌套的对象，内部方法的this指向离被调用函数最近的对象（window也是对象，其内部对象调用方法的this指向内部对象， 而非window）。
//1
var o = {
    prop: 37,
    f: function() {
        return this.prop;
    },
    showLines: function() {
        return "///////";
    }
};
console.log("o.f():"+o.f()+"\no.f.type:"+typeof o.f);   //o.f():37  o.f.type:function
console.log("o.prop:"+o.prop);  //o.prop:37
var a = o.f;
console.log("a:"+a + "\na.type:" + typeof a);   //a.type:function

console.log("a():"+a());    //undefined

var aa = o.showLines;
console.log("aa:"+aa());    //aa:///////

var b = {prop:"b.prop"};
b.fun = o.f;
console.log("b.fun():"+b.fun());    //b.fun():b.prop

var o = {prop2: 37};

function independent() {
    return this.prop2;
}

o.f = independent;

console.log(o.f()); // logs 37

//2
o.b = {
    g: independent,
    prop2: 42
};
console.log("o.b.g():"+o.b.g()+"\n"); // logs 42


//四 原型链中this 原型链中的方法的this仍然指向调用它的对象
var o = {
    f : function(){
        return this.a + this.b;
    }
};
var p = Object.create(o);
p.a = 1;
p.b = 4;

console.log("origin chain1:"+p.f()); // 5

var p1 = {a:4,b:6};
p1.fun = o.f;
console.log("origin chain2:"+p1.fun()+"\n"); // 10

//五 构造函数中this
//构造器可以返回其他的对象,不一定是this
function C(){
    this.a = 37;
}

var o = new C();
console.log("constructor1:"+o.a); // logs 37


function C2(){
    this.a = 37;
    return {a:38,b:40};
}

var b = new C2();
console.log("constructor2:"+"b.a:" + b.a + ",b.b:" + b.b + "\n"); // logs 38


//六 call,apply
// 当函数通过Function对象的原型中继承的方法 call() 和 apply() 方法调用时，
// 其函数内部的this值可绑定到 call() & apply() 方法指定的第一个对象上，
// 如果第一个参数不是对象，JavaScript内部会尝试将其转换成对象然后指向它。
function add(c, d){
    return this.a + this.b + c + d;
}

var o = {a:1, b:3};

console.log("call apply1:"+add.call(o, 5, 7))   ; // 1 + 3 + 5 + 7 = 16

console.log("call apply2:"+add.apply(o, [10, 20])); // 1 + 3 + 10 + 20 = 34

function tt() {
    console.log("this:"+this);
    return this;
}
// 返回对象见下图（图1）
console.log("call apply3:"+tt.call(5));  // Number {[[PrimitiveValue]]: 5}
console.log("call apply4:"+tt.call('asd') + "\n"); // String {0: "a", 1: "s", 2: "d", length: 3, [[PrimitiveValue]]: "asd"}

//七 bind 方法
//bind方法在ES5引入， 在Function的原型链上， Function.prototype.bind。
//通过bind方法绑定后， 函数将被永远绑定在其第一个参数对象上， 而无论其在什么情况下被调用。
function f(){
    return this.a;
}

var g = f.bind({a:"azerty"});
console.log(g()); // azerty

var o = {a:37, f:f, funG:g};
console.log("",+"o.f():"+o.f()+ "o.funG()" + o.funG()); // 37, azerty

//八 DOM 事件处理函数
// 被调用时，将关联的元素变成蓝色
function bluify(e){
    //在控制台打印出所点击元素
    console.log(this);
    //阻止时间冒泡
    e.stopPropagation();
    //阻止元素的默认事件
    e.preventDefault();
    this.style.backgroundColor = '#A5D9F3';
}

// 获取文档中的所有元素的列表
var btn = document.getElementById("btn");
btn.addEventListener('click',bluify,false);

//九 内联事件->/Users thisDemo/index.html

//十 setTimeout & setInterval
//对于延时函数内部的回调函数的this指向全局对象window（
//当然我们可以通过bind方法改变其内部函数的this指向）
//默认情况下代码
//function Person() {
//    setTimeout(function() {
//        console.log(this);
//    }, 1000);
//}
//
//var p = new Person();//3秒后返回 window 对象

//通过bind绑定
function Person() {
    setTimeout((function() {
        console.log('bind this:' + this + 'this.type:' + typeof this + '\n');
    }).bind(this), 1000);
}

var p = new Person();//3秒后返回构造函数新生成的对象 Person{...}


//十一 箭头函数中的 this
//////////////////////////////////////
//由于箭头函数不绑定this， 它会捕获其所在（即定义的位置）上下文 的this值， 作为自己的this值，
//所以 call() / apply() / bind() 方法对于箭头函数来说只是传入参数，对它的 this 毫无影响。
//考虑到 this 是词法层面上的，严格模式中与 this 相关的规则都将被忽略。（可以忽略是否在严格模式下的影响）
function Car() {
    this.age = 0;
    setTimeout(() => {
        this.age++;
        console.log('arrow one this.age:' + this.age + '\n');
    },1000);
//    setInterval(() => {
//        // 回调里面的 `this` 变量就指向了期望的那个对象了
//        this.age++;
//}, 3000);
}
//以上代码可以得到我们所以希望的值，下图可以看到，
//在setTimeout中的this指向了构造函数新生成的对象，而普通函数指向了全局window对象
var p = new Car();
//////////////////////////////////////
var adder = {
    base : 1,

    add : function(a) {
        var f = v => v + this.base;
        return f(a);
    },

    addThruCall: function inFun(a) {
        var f = v => v + this.base;
        var b = {
            base : 2
        };

        return f.call(b, a);
    }
};
// 输出 2
console.log("arrow fun2: adder.add:"+adder.add(1));
// 仍然输出 2（而不是3，其内部的this并没有因为call() 而改变，其this值仍然为函数inFun的this值，指向对象adder
console.log("arrow fun2: adder.addThruCall:"+adder.addThruCall(1));
//////////////////////////////////////
//对于是否严格模式示例代码（可以复制进控制台进行验证）
var f = () => {'use strict'; return this};
var p = () => { return this};
console.log('arrow fun3 f() === window:' + (f() === window));
console.log('arrow fun3 f() === p():'+ (f() === p()));
//1 true
//2 true
//////////////////////////////////////
//以上的箭头函数都是在方法内部，总之都是以非方法的方式使用，如果将箭头函数当做一个方法使用会怎样呢？
//可以看到，作为方法的箭头函数this指向全局window对象，而普通函数则指向调用它的对象
var obj = {
    i: 10,
    b: () => console.log('arrow fun4 b() this.i:' +  this.i + ' this:' + this),
    c: function() {
        console.log('arrow fun4 c() this.i:' + this.i + ' this:' + this + '\n');
    }
}
obj.b();  // undefined window{...}
obj.c();  // 10 Object {...}

//材料引用自
//1 https://www.jianshu.com/p/16dd8acb0b13
//2 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this#%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84_this
//3 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arrow_functions#%E5%83%8F%E6%96%B9%E6%B3%95%E4%B8%80%E6%A0%B7%E4%BD%BF%E7%94%A8%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0

