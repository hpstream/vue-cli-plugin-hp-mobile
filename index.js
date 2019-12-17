var path = require('path');
module.exports = (api, projectOptions) => {
 
  api.chainWebpack(config => {
    // 修改 webpack 配置
    // 或返回通过 webpack-merge 合并的配置对象
    
      // webpackConfig.entry= {
      //    app: ['./src/app/text/js/index.js']
      // }

     
  })
}