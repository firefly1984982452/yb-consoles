export default {
  usage(item, split) {
    if (!split) {
      split = "，";
    }
    let str = "";
    if (item.way) {
      str += item.way + split;
    }
    if (item.rate) {
      str += item.rate + split;
    }

    if (item.useTime) {
      str += item.useTime + split;
    }
    if (item.useRemark) {
      str += item.useRemark + split;
    }
    if (str.length > 1) {
      return str.substring(0, str.length - 1);
    }
    return "";
  }
}
