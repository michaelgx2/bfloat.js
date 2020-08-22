const _letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z'];
const _maxDigitScale = 16;


export default function BFloat(num, scale) {
    this._num = num;
    if (scale == undefined) {
        this._scale = 0;
    }
    else {
        this._scale = scale;
    }
    this.cutNumber();
}

BFloat.prototype.cutNumber = function () {
    let intPart = Math.floor(this._num);
    if (intPart == 0 && this._scale > 0) {
        if (this._num != 0) {
            while (Math.floor(this._num) == 0) {
                this._scale -= 1;
                this._num *= 10;
            }
        }
    }
    else {
        let numScale = (intPart+"").length - (this._num < 0 ? 1 : 0);//获取整数部分长度，负数需要额外减一
        this._scale += numScale - 1;
        this._num /= Math.pow(10, numScale - 1);
    }
}

BFloat.prototype.changeScale = function (newScale) {
    let diff = newScale - this._scale;
    if (diff > _maxDigitScale) {
        this._num = 0;
        this._scale = newScale;
    }
    else if (diff < -4) {
        console.error('禁止的位移方向');
    }
    else {
        this._num /= Math.pow(10, diff);
        this._scale = newScale;
    }
}

//运算符
BFloat.prototype.plus = function (right) {
    let left = this;
    let ret = new BFloat(left._num, left._scale);
    //修正位数
    if (left._scale > right._scale) {
        right.changeScale(left._scale);
    }
    else if (left._scale < right._scale) {
        left.changeScale(right._scale);
    }

    ret._scale = left._scale;
    ret._num = left._num + right._num;
    ret.cutNumber();
    return ret;
}

BFloat.prototype.subtract = function (right) {
    let left = this;
    let ret = new BFloat(left._num, left._scale);
    //修正位数
    if (left._scale > right._scale) {
        right.changeScale(left._scale);
    }
    else if (left._scale < right._scale) {
        left.changeScale(right._scale);
    }

    ret._scale = left._scale;
    ret._num = left._num - right._num;
    ret.cutNumber();
    return ret;
}

BFloat.prototype.multiply = function (right) {
    let left = this;
    let ret = new BFloat(left._num, left._scale);
    ret._num = left._num * right._num;
    ret._scale = left._scale + right._scale;
    ret.cutNumber();
    return ret;
}

BFloat.prototype.devide = function (right) {
    let left = this;
    let ret = new BFloat(left._num, left._scale);
    if (left._scale < right._scale) {
        left.changeScale(right._scale);
    }
    ret._num = left._num / right._num;
    ret._scale = left._scale - right._scale;
    ret.cutNumber();
    return ret;
}

BFloat.prototype.pow = function (doubleY) {
    let x = this;
    let ret = new BFloat(x._num, x._scale);
    ret._scale = x._scale * doubleY;
    ret._num = Math.pow(x._num, doubleY);
    ret.cutNumber();
    return ret;
}

BFloat.prototype.equals = function (obj) {
    return this._num == o._scale && this._scale == o._scale;
}

BFloat.prototype.gt = function (right) {
    let left = this;
    //修正位数
    if (left._scale > right._scale) {
        right.changeScale(left._scale);
    }
    else if (left._scale < right._scale) {
        left.changeScale(right._scale);
    }

    return left._num > right._num;
}

BFloat.prototype.lt = function (right) {
    let left = this;
    //修正位数
    if (left._scale > right._scale) {
        right.changeScale(left._scale);
    }
    else if (left._scale < right._scale) {
        left.changeScale(right._scale);
    }

    return left._num < right._num;
}

//字符化
BFloat.prototype.toLetterString = function () {
    this.cutNumber();
    let ret = "";
    if (this._num == 0) {
        ret = "0";
    }
    else if (this._scale < 3) {
        ret = parseFloat((this._num * Math.pow(10, this._scale)).toFixed(3)) + "";
    }
    else {
        //先求出位数对3的余数，确定需要进行移位的次数
        let needChange = parseInt(Math.floor(Math.floor(this._scale) % 3)+"");
        //然后进行小数点向右的余数次位移，使得位数变为3的倍数
        if (needChange != 0) {
            this.changeScale(this._scale - needChange);
        }
        //根据当前的实数和位数进行字符化
        let unit = "";
        if (this._scale <= 3) {
            unit = "k";
        }
        else if (this._scale <= 6) {
            unit = "m";
        }
        else if (this._scale <= 9) {
            unit = "b";
        }
        else if (this._scale <= 12) {
            unit = "t";
        }
        else {
            let sb = "";
            let ss = Math.floor(((this._scale - 13) / 3) % 26);//26字母余数
            //先插入最后一位字母
            sb += _letters[ss];
            //循环处理轮数，反复求余
            let sd = Math.floor((((this._scale - 13) / 3) / 26 + 1).toFixed(0));//26字母轮数
            while (true) {
                if (sd <= 26) {
                    sb = _letters[sd - 1] + sb;
                    break;
                }
                else {
                    ss = parseInt(Math.floor((sd) % 26)+"");//26字母余数
                    sb = _letters[ss] + sb;
                    sd = Math.floor((sd / 26).toFixed(0));//26字母轮数
                }
            }

            unit = "" + sb;
        }
        ret = parseFloat(this._num.toFixed(3)) + "" + unit;
    }
    return ret;
}

BFloat.prototype.toChineseString = function () {
    this.cutNumber();
    let ret = "";
    if (this._num == 0) {
        ret = "0";
    }
    else if (this._scale < 4) {
        ret = parseFloat((this._num * Math.pow(10, this._scale)).toFixed(3)) + "";
    }
    else {
        if (this._scale <= 15) {
            let unit = "";
            let needChange = parseInt(Math.floor(Math.floor(this._scale) % 3)+"");
            //然后进行小数点向右的余数次位移，使得位数变为3的倍数
            if (needChange != 0) {
                this.changeScale(this._scale - needChange);
            }
            if (this._scale <= 4) {
                unit = "万";
            }
            else if (this._scale <= 8) {
                unit = "亿";
            }
            else {
                unit = "兆";
            }
            ret = parseFloat(this._num.toFixed(2)) + "" + unit;
        }
        else {
            ret = this.toLetterString();
        }
    }
    return ret;
}

BFloat.prototype.toString = function(){
    this.cutNumber();
    let ret = "";
    if (this._num == 0)
    {
        ret = "0";
    }
    else if (this._scale <= 3)
    {
        ret = parseFloat((this._num * Math.pow(10, this._scale)).toFixed(3))+"";
    }
    else if (this._scale <= 6)
    {
        ret = Math.floor((this._num * Math.pow(10, this._scale))).toFixed(0);
    }
    else
    {
        ret = parseFloat(this._num.toFixed(3)) + "e" + Math.floor(this._scale);
    }
    return ret;
}