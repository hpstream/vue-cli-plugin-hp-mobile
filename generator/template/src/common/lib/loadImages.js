 /**
  * [loadImages description]
  *
  * @param   {[type]}  sources   // 数组，或者是对象
  * @param   {[type]}  callback  [callback description]
  *
  * @return  {[type]}            [return description]
  */
 function loadImages(sources, callback) {
   var count = 0,
     images = {},
     imgNum = sources.length;
 
   for (let i=0;i<sources.length;i++) { //src 为 img1和img2
     images[i] = new Image(); //images = {img1:img,img2:img}
     images[i].onload = function () { //onload 事件会在页面或图像加载完成后立即发生
       if (++count >= imgNum) { //当次数大于等于2次时
         callback&&callback(images); //调用loadImages的回调函数
       }
     }
     images[i].src = sources[i];
   }
  //  console.log(images);
 }

 export default loadImages;