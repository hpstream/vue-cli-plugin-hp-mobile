// 获取相对于父元素的位置信息

export default function(parentNode, evt) {
    const boundingClientRect = parentNode.getBoundingClientRect();
    const left = boundingClientRect.left;
    const top = boundingClientRect.top;

    return [evt.changedTouches[0].clientX - left, evt.changedTouches[0].clientY - top];
}
