// 获取屏幕与canvas的像素比
export default function(context) {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
}
