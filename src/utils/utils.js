import axios from "axios";

var Sys = {};
Array.prototype.unique = function() { //去数组重复
  return this.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g, "$1$2$4").replace(/,,+/g, ",").replace(/,$/, "")
    .split(",");
}

export function detectiveBrowse() {
  var ua = navigator.userAgent.toLowerCase();
  var s;
  (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]:
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
}

/**
 * 判断是否null
 * @param data
 */

//提取富文本的纯文本
export function repalceHtml(str) {
  if (typeof(str) == 'string') {
    var dd = str.replace(/<\/?.+?>/g, "");
    var dds = dd.replace(/ /g, ""); //dds为得到后的内容
    return dds;
  }
}

export function isNull(data) {
  return (data == "" || data == undefined || data == null);
}

// 检查手机号
export function checkMobile(s) {
  if (!(/^1[345789]\d{9}$/.test(s))) {
    return false;
  }
  return true;
};

//校验EMAIL
export function checkEmail(s) {
  var patrn = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  if (!patrn.exec(s)) return false
  return true
}

//校验QQ
export function checkQQ(s) {
  var patrn = /^[1-9]\d{4,9}$/;
  if (!patrn.exec(s)) return false
  return true
}

//校验微信号
export function checkWeixin(s) {
  var patrn = /^[a-zA-Z\d_]{5,}$/;
  if (!patrn.exec(s)) return false
  return true
}

//校验密码：只能输入6-20个字母、数字、下划线
export function checkPasswd(s) {
  var patrn = /^(\w){6,20}$/;
  if (!patrn.exec(s)) return false
  return true
}

//校验是否全由数字组成
export function checkDigit(s) {
  var patrn = /^[0-9]{1,20}$/;
  if (!patrn.exec(s)) return false
  return true
}

//一般格式化到时间   new Date(时间戳)
export function formatTime(date) {
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  let D = date.getDate() + ' '
  let h = date.getHours() + ':'
  let m = date.getMinutes() + ':'
  let s = date.getSeconds()
  let time = Y + M + D + h + m + s
  return time
}

//时间戳格式化到天
export function formatDay(date) {
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  let D = date.getDate() + ' '
  let h = date.getHours() + ':'
  let m = date.getMinutes() + ':'
  let s = date.getSeconds()
  let day = Y + M + D
  return day
}

export function getRandomStr(len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

export function getRandomNumber(len) {
  var text = "";
  var possible = "0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// 接收一个函数,和延时的时间
export function debounce(func, delay) {
  let timer

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function getNowFormatDate(time) {
  if (Sys.safari) time = time.replace(/\-/g, "/");
  var date = new Date(time);
  var seperator1 = "-";
  var seperator2 = ":";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var minute = date.getMinutes()
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (minute <= 9 && minute >= 0) {
    minute = "0" + minute;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    " " + date.getHours() + seperator2 + minute;
  return currentdate;
}

/**
 * Created by jerry on 2017/4/14.
 */
var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'

function padding(s, len) {
  let l = len - (s + '').length
  for (var i = 0; i < l; i++) {
    s = '0' + s
  }
  return s
};

export default {
  getQueryStringByName: function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    var context = ''
    if (r != null) {
      context = r[2]
    }
    reg = null
    r = null
    return context === null || context === '' || context === 'undefined' ? '' : context
  },

  formatDate: {
    format: function(date, pattern) {
      pattern = pattern || DEFAULT_PATTERN
      return pattern.replace(SIGN_REGEXP, function($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length)
          case 'M':
            return padding(date.getMonth() + 1, $0.length)
          case 'd':
            return padding(date.getDate(), $0.length)
          case 'w':
            return date.getDay() + 1
          case 'h':
            return padding(date.getHours(), $0.length)
          case 'm':
            return padding(date.getMinutes(), $0.length)
          case 's':
            return padding(date.getSeconds(), $0.length)
        }
      })
    },
    parse: function(dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP)
      var matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length === matchs2.length) {
        var _date = new Date(1970, 0, 1)
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i])
          var sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int);
              break
            case 'M':
              _date.setMonth(_int - 1);
              break
            case 'd':
              _date.setDate(_int);
              break
            case 'h':
              _date.setHours(_int);
              break
            case 'm':
              _date.setMinutes(_int);
              break
            case 's':
              _date.setSeconds(_int);
              break
          }
        }
        return _date
      }
      return null
    }
  }
}

/***************************************************************************
 * 计算生肖
 *
 * 支持简写生日，比如01，转换为2001，89转换为1989； 支持任何可以进行时间转换的格式，比如'1989/01/01','1989 01'等
 *
 */
export function getShengXiao(birth) {
  birth += '';
  let len = birth.length;
  if (len < 4 && len != 2) {
    return "";
  }
  if (len == 2) {
    birth - 0 > 30 ? birth = '19' + birth : birth = '20' + birth;
  }
  let year = (new Date(birth)).getFullYear();
  let arr = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
  return /^\d{4}$/.test(year) ? arr[year % 12] : "";
}

/***************************************************************************
 * 计算星座
 *
 *
 */
export function getAstro(y, m, d) {
  let constellations = [{
    "Start": 121,
    "End": 220,
    "Name": "水瓶座"
  }, {
    "Start": 221,
    "End": 320,
    "Name": "双鱼座"
  }, {
    "Start": 321,
    "End": 420,
    "Name": "白羊座"
  }, {
    "Start": 421,
    "End": 520,
    "Name": "金牛座"
  }, {
    "Start": 521,
    "End": 620,
    "Name": "双子座"
  }, {
    "Start": 621,
    "End": 720,
    "Name": "巨蟹座"
  }, {
    "Start": 721,
    "End": 820,
    "Name": "狮子座"
  }, {
    "Start": 821,
    "End": 920,
    "Name": "处女座"
  }, {
    "Start": 921,
    "End": 1020,
    "Name": "天秤座"
  }, {
    "Start": 1021,
    "End": 1120,
    "Name": "天蝎座"
  }, {
    "Start": 1121,
    "End": 1220,
    "Name": "射手座"
  }];
  /*
   * 判断日期有效性 1,3,5,7,8,10,12为31天 2月润年29，非润年28 4,6,9,11为30天
   */
  let daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // 检测年份
  if (y < 1970 || y > 2099)
    return "";

  // 检测月份
  if (m < 1 || m > 12)
    return "";

  // 检测日期
  let mDays = daysInMonth[m - 1];
  // 如果是二月，要根据年份计算天数，不是二月时略过此计算
  if (m == 2) {
    mDays = GetSpecialDays(y)
  }

  // 判断日数据是不是在月份的有效天范围
  if (d < 0 || d > mDays)
    return "";

  // 好了，走到这一步，说明上面的验证都TM过了。
  // 这才判断是哪一个星座
  // 星座座标等于m*100 + d
  let pos = parseInt(m * 100) + parseInt(d);
  for (let i in constellations) {
    if (pos >= constellations[i].Start && pos <= constellations[i].End) {
      return constellations[i].Name;
    }
  }
  return "摩羯座";
}

/***************************************************************************
 * 计算年龄
 *
 * 支持传递["yyyy-MM-dd"]等格式的字符串
 *
 */
export function getAge(str) {
  let r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  if (r == null)
    return false;
  let d = new Date(r[1], r[3] - 1, r[4]);
  if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] &&
    d.getDate() == r[4]) {
    let Y = new Date().getFullYear();
    return (Y - r[1]);
  }
  return "";
}

/***************************************************************************
 * 根据年份计算二月天数
 *
 *
 *
 */
export function GetSpecialDays(y) {
  if (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0))
    return 29;
  return 28;
}

//图片
export const OssUrlPic = '//image.youbankeji.com/'
//非图片
export const OssUrlNoPic = '//res.youbankeji.com/'

export const ImageBase = '//image.youbankeji.com/'
export const VideoBase = '//res.youbankeji.com/'

export const DefaultImage = ''

export function detectiveNumber(number) {
  var reg = /^[0-9]*$/;
  return reg.test(number);
}

// 护理等级、长护险等级
export const ElderLevelType = [{
    title: '无护理',
    value: 0
  }, {
    title: '护理一级',
    value: 1
  }, {
    title: '护理二级',
    value: 2
  }, {
    title: '护理三级',
    value: 3
  }, {
    title: '护理四级',
    value: 4
  }, {
    title: '护理五级',
    value: 5
  }, {
    title: '护理六级',
    value: 6
  },
  {
    title: '外地',
    value: 7
  },
  {
    title: '不满60岁',
    value: 8
  },
  {
    title: '享受居家养老',
    value: 9
  }
]

//检查以|分隔的电话号码正确验证
export function checkPhone(data) {
  if (!/^(1[34578]\d{9}\|)*(1[34578]\d{9})$/.test(data)) {
    return false
  }
  return true
}

//邮箱正则
export function checkMail(data) {
  if (!/^(\w+@[0-9a-zA-Z\-]+(\.[a-zA-Z]{2,6}){1,2},)*(\w+@[0-9a-zA-Z\-]+(\.[a-zA-Z]{2,6}){1,2})$/g.test(data)) {
    return false
  }
  return true
}

//检查以,分隔的电话号码正确验证
export function checkTelphone(data) {
  var pattern = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/;
  if (pattern.test(data)) {
    return true;
  } else {
    return false;
  }
  // if (!/^(1[34578]\d{9},)*(1[34578]\d{9})$/.test(data)) {
  //   return false
  // }
  // return true
}


export function dealWidthSpace(data) {
  let newString = data.replace(/\n/g, '_@').replace(/\r/g, '_#');
  newString = newString.replace(/_#_@/g, '<br/>'); //IE7-8
  newString = newString.replace(/_@/g, '<br/>'); //IE9、FF、chrome
  newString = newString.replace(/\s/g, '&nbsp;'); //空格处理
  return newString;
}

export function exportExcel(dada) {
  axios({
    method: dada.method,
    url: dada.url,
    responseType: 'blob'
  }).then((res) => {
    const link = document.createElement('a');
    let blob = new Blob([res.data], {
      type: 'application/vnd.ms-excel'
    });
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    link.download = dada.fileName; // 下载文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }).catch(error => {
    console.log('导出表格错误！');
  });
}

export const RegexMatch = [{
  title: '手机号',
  value: '^1[34578]\\d{9}$'
}, {
  title: '身份证',
  value: '(^\\d{15}$)|(^\\d{17}(x|X|\\d)$)'
}, {
  title: '邮箱',
  value: '^\\w+@[0-9a-zA-Z\\-]+(\\.[a-zA-Z]{2,6}){1,2}$'
}, {
  title: '中文',
  value: '^[\u4e00-\u9fa5]+$'
}, {
  title: '数字',
  value: '^[0-9]+$'
}, {
  title: '不限',
  value: ''
}]

// 指定日期的周的第几天
export function weDateFormat(date) {
  let weekOfDay = window.$moment(date).format("E") // 指定日期的周的第几天
  
  let lastMonday = window.$moment(date).subtract(weekOfDay-1, 'days').format('YYYY-MM-DD');//周一日期
  let lastTuesday = window.$moment(date).subtract(weekOfDay-2, 'days').format('YYYY-MM-DD');//周二日期
  let lastWednesday = window.$moment(date).subtract(weekOfDay-3, 'days').format('YYYY-MM-DD');//周三日期
  let lastThursday = window.$moment(date).subtract(weekOfDay-4, 'days').format('YYYY-MM-DD');//周四日期
  let lastFriday = window.$moment(date).subtract(weekOfDay-5, 'days').format('YYYY-MM-DD');//周五日期
  let lastSaturday = window.$moment(date).subtract(weekOfDay-6, 'days').format('YYYY-MM-DD');//周六日期
  let lastSunday = window.$moment(date).add(7-weekOfDay, 'days').format('YYYY-MM-DD');//周日日期
    return { lastMonday, lastTuesday, lastWednesday, lastThursday, lastFriday, lastSaturday, lastSunday
  }
}