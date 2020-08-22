# bfloat.js
Javascript version for BFloat.  [C# Version](https://github.com/michaelgx2/BFloat)

Big float number type. Support plus, subtract, multiply, devide and power.
Use toString() method to format it with scientific notation.
Use toLetterString() method to format it like "12.3ab".
Use toChineseString() method to format it with Chinese words such as "万/亿/兆".

This data type is designed for idle game development. It only support 14 digits accuracy. Thus not usable in scientific caculations.
The code is written for Vue.js framework. If you do not use Vue, just modify the code for yourself. It should be easy.

# bfloat.js
Javascript版本的BFloat。[C# 版本](https://github.com/michaelgx2/BFloat)

超大数类型，支持加减乘除和乘方运算。
toString()方法输出为科学计数法；
toLetterString()方法输出为12.3ab这样的字符串；
toChineseString()方法输出为带有"万/亿/兆"这些中文词的样子；

这个数据类型被设计来制作放置游戏，仅支持14位精度，不适合科学计算。
代码是在Vue.js框架下编写并使用的，如果你不用Vue.js，可以对源码稍作改造，去除几行Vue相关的代码即可。

# Example
``` javascript
let a = BFloat(5, 6);//此时a代表5e6, 也就是5000000 / a is now 5e6, which is 5000000
let b = BFloat(5000000);//此时b也代表5e6 / b is now also 5e6
let res1 = a.plus(b);//加法
let res2 = a.subtract(b);//减法
let res3 = a.multiply(b);//乘法
let res4 = a.devide(b);//除法
let res5 = a.pow(100);//乘方运算，仅支持普通的数字参数 / pow method only supports normal number type.
let str1 = a.toString();//显示为科学计数法 / 5e6
let str2 = a.toLetterString();//显示为字母计数法 / 5m
let str3 = a.toChineseString();//显示为中文计数法（仅15位以内） / 500万
```