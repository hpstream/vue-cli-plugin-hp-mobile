// 处理 play.js 和 draw.js 不一样的地方

import Draw from './draw';

class DealData extends Draw {
    // 保存操作处理
    saveOperation(type, path, data) {
        if (data) {
            const {
                linewidth,
                color
            } = data;

            // 普通画笔
            if (type === 1) {
                super.brushWidth(linewidth);
                super.brushColor(color);
            }

            // 橡皮擦
            if (type === 2) {
                super.eraser(linewidth);
            }
        }

        super.saveOperation(type, path);
    }
}

export default DealData;
