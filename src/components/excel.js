/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param {*} url 下载地址，也可以是一个blob对象，必选
 * @param {String} saveName 保存文件名，可选
 */
export function openDownloadDialog(url, saveName) {
  if (typeof url == 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) {
    event = new MouseEvent('click');
  } else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}

/**
 * 将一个workbook转成最终的excel文件的blob对象，然后可以利用URL.createObjectURL下载
 * @param {*} workbook 工作簿对象
 */
export function workbook2blob(workbook) {
  // 生成excel的配置项
  var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  };
  var wbout = XLSX.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  });
  // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  return blob;
}

/**
 * 将一个sheet转成最终的excel文件的blob对象，然后可以利用URL.createObjectURL下载
 * @param {*} sheet excel里的sheet
 * @param {String} sheetName sheet标签名称
 */
export function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1';
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet;
  return workbook2blob(workbook);
}

/**
 * 多个表格转换成Excel并下载
 * @param {Array} tables 表格<table />引用的数组
 * @param {String} saveName 保存的Excel文件名
 */
export function tablesToExcel(tables, saveName) {
  if (!tables) {
    return;
  }
  if (!(tables instanceof Array)) {
    return;
  }
  var workbook = {
    SheetNames: [],
    Sheets: {}
  };
  let i = 1;
  tables.forEach(table => {
    let sheetName = table.title ? table.title : ('sheet' + i++);
    workbook.SheetNames.push(sheetName);
    workbook.Sheets[sheetName] = XLSX.utils.table_to_sheet(table,{raw:true});
  });
  openDownloadDialog(workbook2blob(workbook), saveName || '数据导出.xlsx');
}

/**
 * 单个表格转换成Excel并下载
 * @param {*} table 表格<table />引用
 * @param {String} saveName 保存的Excel文件名
 */
export function tableToExcel(table, saveName) {
  if (!table) {
    return;
  }
  let sheet = XLSX.utils.table_to_sheet(table,{raw:true});
  openDownloadDialog(sheet2blob(sheet), saveName || '数据导出.xlsx');
}

/**
 * 对象数组转换成Excel并下载
 * @param {Array} list 对象数组：[{},{},{},...]
 * @param {Object} map 对象字段名称或格式转换对象，形如：{ elderName:"姓名", status:{title:"状态", format: value => {}}}
 * @param {String} saveName 保存的Excel文件名
 */
export function dataToExcel(list, map, saveName, header, footer) {
  if (!list) {
    return;
  }
  let sheet;
  if (map) {
    let keys = Object.keys(map);
    let values = [];
    keys.forEach(key => {
      let title = map[key];
      if (typeof title === 'object') {
        title = title.title;
      }
      values.push(title);
    });
    let list1 = [];
    if (header) {
      list1.push([header]);
    }
    list1.push(values);
    list.forEach(item => { 
      values = [];
      keys.forEach(key => {
        let value = item[key];
        let mapValue = map[key];
        if (typeof mapValue === 'object') {
          let format = mapValue.format;
          if (typeof format === 'function') {
            value = format(value, item);
          }
        }
        values.push(value);
      });
      list1.push(values);
    });
    if (footer) {
      list1.push([footer]);
    }
    sheet = XLSX.utils.aoa_to_sheet(list1);
  } else {
    sheet = XLSX.utils.json_to_sheet(list);
  }
  openDownloadDialog(sheet2blob(sheet), saveName || '数据导出.xlsx');
}