export default {
  /* 根据生日计算年龄 */
  getAge(date, full = false) {
    let birthDay = new Date(date)
    let nowDate = new Date()
    let date1 = Date.parse(birthDay)
    let date2 = Date.parse(nowDate)
    let day = Math.ceil((date2 - date1) / (60 * 60 * 1000 * 24))
    let year = Math.floor(day / 365)
    if(full) {
      let y = day % 365
      let month = Math.floor(y / 30)
      let d = Math.floor(day % 365 % 30)
      let age = year + '岁' + month + '月' + d + '天'
      return age
    } else {
      return year;
    }
  },
  // 将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // dateFormat(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  dateFormat(date, fmt) {
    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
}