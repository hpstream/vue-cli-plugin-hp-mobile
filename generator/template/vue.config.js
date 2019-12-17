console.log('------------------------------------');
console.log(process.env.proxyUrl);
console.log('------------------------------------');

module.exports = {
  devServer: {
    proxy: { //配置代理
      '/web/webApi': {
        target: proxyUrl,
        secure: false,
        changeOrigin: true
      }
    }
  }
}