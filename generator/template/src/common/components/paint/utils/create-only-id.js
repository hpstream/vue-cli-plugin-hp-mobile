// 生成唯一Id

let uniqueId = 1;

export default function() {
    const onlyId = 'canvas_' + (uniqueId++) + '_' + new Date().getTime();

    return onlyId;
}
