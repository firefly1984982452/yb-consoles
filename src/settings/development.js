module.exports = {
  appNo: "console", // 应用编码
  servers: {
    // 服务器地址列表
    commonServer: "http://localtest.youbankeji.com/common-api", //公共服务
    // commonServer: "http://192.168.3.14:8086", //公共服务
    userServer: "https://localtest.youbankeji.com/user-api", //用户服务
    // userServer: "http://192.168.3.155:8085", //用户服务
    statServer: "http://localtest.youbankeji.com/stat-api", //统计服务
    // statServer: "http://192.168.3.14:8096", //统计服务
    oaServer: "http://localtest.youbankeji.com/oa-api", //办公服务
    // oaServer: "http://192.168.3.14:8088", //办公服务
    attendanceServer: "http://localtest.youbankeji.com/attendance-api", //考勤排班服务
    medicalServer: "http://localtest.youbankeji.com/medical-api", //考勤排班服务
    // medicalServer: "http://192.168.3.44:8083", //医护服务
    fireServer: "http://localtest.youbankeji.com/fire-api", //消防服务
    // fireServer: "http://192.168.3.70:8084", //消防服务
    elderServer: "http://localtest.youbankeji.com/elder-api", //老人服务
    // elderServer: "http://192.168.3.132:8087", //老人服务
    mediaServer: "http://localtest.youbankeji.com/media-api", //媒体服务，比如上传文件等
    // mediaServer: "http://192.168.3.96:8087", //媒体服务，比如上传文件等
    financeServer: "http://localtest.youbankeji.com/finance-api", //结算服务
    // financeServer: "http://192.168.3.14:8095", //结算服务
    familyServer: "http://localtest.youbankeji.com/family-api", //家属服务
    datasyncServer: "http://localtest.youbankeji.com/datasync-api", // 区网同步服务
    careServer: "http://localtest.youbankeji.com/care-api", // 护理服务
    // careServer: "http://192.168.3.14:8099", //护理服务
    visitServer: "http://localtest.youbankeji.com/guard-api", // 门卫服务
    // visitServer: "http://192.168.3.155:8098", // 门卫服务
    dietServer: "http://localtest.youbankeji.com/diet-api", //点餐服务
    // dietServer: "http://192.168.3.132:8091", //点餐服务
    activityServer: "http://localtest.youbankeji.com/activity-api", //活动服务（开心养老）
  }
};
