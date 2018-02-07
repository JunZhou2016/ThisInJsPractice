//测试js中this真正含义的js代码;
/**
 * 总结：判断this的含义，关键是判断this的引用地址；
 *       对普通函数，this指向的是调用者['.'之前的，没有'.'则为全局对象];
 *       箭头函数中的this指向为定义箭头函数的作用域中的this【是作用域中的this而不是定义的作用域】;
 * 方法：1.首先找到调用方法所在的连续内存空间;
 *       2.当方法的前面没有调用句柄的时候，可以默添加
 *      this作为调用的句柄，此时this指向全局对象，在js
 *      中this指代window全局对象，在value中this指代global
 *      对象;
 */
function test1() {
    console.log(this);
    alert("打印出了全局对象【global/window】[Window {frames: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}]");
};
test1();
console.log("----------------作为对象的方法调用-------------------");
var obj1 = {
    name: 'qiutc',
    foo: function () {
        console.log(this.name);
    }
}
obj1.foo();

console.log("-----------------------------------");

function test2() {
    console.log(this.name);
}

var obj2 = {
    name: 'qiutc',
    foo2: test2
}
obj2.foo2();

console.log("--------------把对象的方法赋值给一个变量，然后直接调用这个变量---------------------");
var obj3 = {
    name: 'qiutc',
    foo3: function () {
        console.log(this);
    }
}
var test3 = obj3.foo3;
test3();

console.log("--------------利用 闭包 的特性来绑定this---------------------");

//为了避免对下面测试中定时器的影响，注释了当前代码块;
/**
  * var obj4 = {
    name: 'qiutc',
    foo: function () {
        console.log(this);
    },
    foo2: function () {
        console.log(this);
        var _this = this;
        setTimeout(function () {
           // console.log(this);
           console.log(_this);
        }, 1000);
    }
}
obj4.foo2();
  */


console.log("--------------箭头函数---------------------");
/**
 * 箭头函数中的 this 只和定义它时候的作用域的 this 有关;
 * 即：[箭头函数中的this和定义它的作用域中的this相等];
 * 函数参数列表中的箭头函数的是定义在外部的，但是其作用域在方法内部;
 * 而与在哪里以及如何调用它无关，同时它的 this 指向是不可改变的。
 */
/**
 * var obj5 = {
    name: 'qiutc',
    foo: function () {
        console.log(this);
    },
    foo2: function () {
        console.log("obj5--》a" + this);
        setTimeout(() => {
            console.log("obj5--》b" + this);
        }, 1000);
    }
}
obj5.foo2();
 */

console.log("--------------通过call, apply, bind给函数绑定指定的this对象---------------------");
console.log("-----------------------为一个普通函数指定 this---------------------");
var obj7 = {
    name: 'qiutc'
};

function foo7() {
    console.log(this);
}
foo7.call(obj7);

console.log("-----------------------为对象中的方法指定一个 this---------------------");
var obj = {
    name: 'qiutc',
    foo: function () {
        console.log(this);
    }
}
var obj2 = {
    name: 'tcqiu222222'
};
obj.foo.call(obj2);

console.log("-----------------------为箭头函数指定 this【无效性验证】---------------------");

var afoo = (a) => {
    console.log(a);
    console.log(this);
}
afoo(1);
var obj = {
    name: 'qiutc'
};
afoo.call(obj, 2); //期望输出：obj;实际输出:全局对象;

//箭头函数的总结
/**
 * 可以看到，这里的 call 指向 this 的操作并没有成功，所以可以得出： 
 * 箭头函数中的 this 在定义它的时候已经决定了（执行定义它的作用域中的 this），
 * 与如何调用以及在哪里调用它无关，包括 (call, apply, bind) 等操作都无法改变它的 this。
 *只要记住箭头函数大法好，不变的 this。
 */