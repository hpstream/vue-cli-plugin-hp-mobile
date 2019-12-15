module.exports = (api, options, rootOptions) => {
  
   api.extendPackage({
     scripts: {
       test: 'vue-cli-service test'
     },
     "husky": {
       "hooks": {
         "pre-commit": "lint-staged"
       }
     },
     "lint-staged": {
       "src/**/*.js": [
         "eslint --fix",
         "git add"
       ],
       "src/**/*.less": [
         "stylelint --fix",
         "git add"
       ]
     },
     "devDependencies": {
       "eslint": "^5.16.0",
       "husky": "^2.3.0",
       "lint-staged": "^7.2.2",
       "stylelint": "^10.0.1"
     },
     "dependencies": {
       "front-common": "git+ssh://git@git.wb-intra.com:web_group/front-common.git",
     }
   })
  // 复制并用 ejs 渲染 `./template` 内所有的文件
  api.render('./template')
  console.log('------------------------------------');
  console.log(11333);
  console.log('------------------------------------');

}