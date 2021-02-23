export default {
  status(row, column, value, index) {
    return value ? '有效' : '无效';
  },
  syncStatus(row, column, value, index) {
    return value ? '是' : '否';
  },
  date(row, column, value, index) {
    return value ? value.substr(0, 10) : '';
  }
}