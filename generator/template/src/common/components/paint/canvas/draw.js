// 绘画：为 draw.vue 服务
// 主要就是基础功能的实现以及touch事件的处理

import getPos from '../utils/get-position';
import Board from './board';
import Stack from './stack';

class Draw extends Board {
    constructor(id, context, canvasWidth) {
        super(id, canvasWidth);

        this.context = context;
        this.canvas = document.getElementById(id);

        this.isDown = false; // 是否按下
        this.beginPoint = null; // 初始点
        this.path = [];
        this.type = 1; // 1:普通画笔，2:橡皮擦

        this.stack = new Stack(id);

        // 初始化画布相关信息
        super
            .changeBackground(this.context.background)
            .changeBrushWidth(this.context.brushWidth)
            .changeBrushColor(this.context.brushColor);

        this.context.$emit('beforepaint');
    }

    // touchstart
    start(evt) {
        this.isDown = true;

        this.context.$emit('painting');

        // 获取起点并绘制
        this.beginPoint = getPos(this.canvas, evt);
        super.drawLine(this.beginPoint);

        this.path.push(this.beginPoint);
    }

    // touchmove
    move(evt) {
        if (!this.isDown) return;

        this.context.$emit('painting');

        this.path.push(getPos(this.canvas, evt));

        // 路径处理
        if (this.path.length >= 2) {
            const lastTwoPoints = this.path.slice(-2);

            // 控制点
            const controlPoint = lastTwoPoints[0];

            // 终点
            const endPoint = [
                (lastTwoPoints[0][0] + lastTwoPoints[1][0]) / 2,
                (lastTwoPoints[0][1] + lastTwoPoints[1][1]) / 2
            ];

            super.drawLine(this.beginPoint, endPoint, controlPoint);
            this.beginPoint = endPoint;
        }
    }

    // touchend
    end(evt) {
        if (!this.isDown) return;

        // 保存当前操作
        this.saveOperation(this.type, this.path);

        // 重置
        this.path = [];
        this.beginPoint = null;
        this.isDown = false;
    }

    // 初始化堆栈
    initStack() {
        this.stack.init();
    }

    // 保存操作
    saveOperation(type, path) {
        this.stack.saveOperation(type, path);
    }

    // 画笔粗细
    brushWidth(props) {
        this.type = 1;
        super.changeBrushWidth(props);
    }

    // 画笔颜色
    brushColor(props) {
        this.type = 1;
        super.changeBrushColor(props);
    }

    // 橡皮擦
    eraser(props) {
        this.type = 2;
        super.eraser(props);
    }

    // 画布颜色
    background(props) {
        super.changeBackground(props);
        this.stack.saveOperation(3);
    }

    // 撤销
    async undo() {
        this.stack.saveOperation(4);

        // 获取撤销数据
        const undoData = this.stack.getUndoData();

        // 清空画板
        super.clearCanvas();

        // 只能用 for，其他的诸如 map、forEach 等，await 不生效
        for (const data of undoData) {
            await super.drawData(data);
        }
    }

    // 恢复
    async redo() {
        this.stack.saveOperation(5);

        // 获取恢复数据
        const redoData = this.stack.getRedoData();

        await super.drawData(redoData);
    }

    // 清除画布
    clear() {
        this.stack.saveOperation(6);
        super.clearCanvas();
    }

    // 获取画好的数据
    getPaintInfo() {
        return this.stack.getPaintInfo();
    }

    // 生成带背景颜色的图片
    async canvasToImageWithBackground() {
        return await super.canvasToImageWithBackground();
    }

    // 选择操作
    selectOperation(type, props) {
        const {
            brushWidth,
            brushColor,
            eraser,
            background,
            undo,
            redo,
            clear,
            getPaintInfo,
            canvasToImageWithBackground
        } = this;

        const operations = new Map([
            [1, brushWidth],
            [2, brushColor],
            [3, eraser],
            [4, background],
            [5, undo],
            [6, redo],
            [7, clear],
            [8, canvasToImageWithBackground],
            [9, getPaintInfo]
        ]);

        const operation = operations.get(type);
        return operation.call(this, props);
    }
}

export default Draw;
