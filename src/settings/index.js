'use strict'

// 根据环境引入不同配置 process.env.ENV_CONFIG  ex:development.js
const setting = require('./' + process.env.NODE_ENV + '.js')
module.exports = setting
