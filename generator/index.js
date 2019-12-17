module.exports = (api, options, rootOptions) => {

  api.extendPackage({
    "scripts": {
      "lint": "eslint --fix  --ext .js,.vue src",
      "watch": "webpack --progress --watch",
      "build": "vue-cli-service build --mode build",
      "dev": "vue-cli-service build --mode develop",
      "start": "vue-cli-service serve --mode start",
      "test": "vue-cli-service build --mode test",
      "update_common": "rm -r -f node_modules/front-common & rm -r -f node_modules/_front-common@1.0.1@front-common & cnpm i"
    },
    "dependencies": {
      "core-js": "^3.4.3",
      "vue": "^2.6.10",
      "vue-router": "^3.1.3",
      "vuex": "^3.1.2"
    },
    "devDependencies": {
      "@vue/cli-plugin-babel": "^4.1.0",
      "@vue/cli-plugin-eslint": "^4.1.0",
      "@vue/cli-plugin-router": "^4.1.0",
      "@vue/cli-plugin-vuex": "^4.1.0",
      "@vue/cli-service": "^4.1.0",
      "@vue/eslint-config-prettier": "^5.0.0",
      "babel-eslint": "^10.0.3",
      "eslint": "^5.16.0",
      "eslint-plugin-prettier": "^3.1.1",
      "eslint-plugin-vue": "^5.0.0",
      "less": "^3.0.4",
      "less-loader": "^5.0.0",
      "prettier": "^1.19.1",
      "vue-template-compiler": "^2.6.10"
    }
  })
  // 复制并用 ejs 渲染 `./template` 内所有的文件
  api.render('./template')


}