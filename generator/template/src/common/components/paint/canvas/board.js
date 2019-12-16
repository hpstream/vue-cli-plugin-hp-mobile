// 画板的基础功能：初始化 canvas 宽高、改变画布颜色、改变画笔粗细、改变画笔颜色、橡皮擦、清空画布、画布生成图片、画图、生成带背景颜色的图片、画画、处理每个操作

import getPixelRatio from './../utils/get-pixel-ratio';
class Board {
    constructor(id, canvasWidth) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.globalComposite = this.ctx.globalCompositeOperation;
        this.initCanvasWidthHeight(canvasWidth);
    }

    // 初始化canvas宽高，画画：当前画布的宽度；回放：获取到的paintInfo里的画布宽度
    initCanvasWidthHeight(canvasWidth) {
        const {
            canvas,
            ctx
        } = this;

        const domWidth = canvas.offsetWidth;
        const scale = getPixelRatio(ctx);

        // 没有canvas宽度传进来时
        if (typeof canvasWidth === 'undefined') {
            this._setCanvasScale(domWidth * scale, scale);
            this.canvasWidth = domWidth;
            return;
        }

        // 有canvas宽度传进来时
        this.canvasWidth = canvasWidth;

        // 计算出的比例小于屏幕与canvas的像素比时
        if ((canvasWidth / domWidth) >= 1 < scale) {
            const canvasScale = domWidth * scale / canvasWidth;
            this._setCanvasScale(domWidth * scale, canvasScale);
            return;
        }

        if ((domWidth / canvasWidth) >= 1 < scale) {
            const canvasScale = canvasWidth * scale / domWidth;
            this._setCanvasScale(canvasWidth * scale, canvasScale);
            return;
        }

        // 大于
        if (canvasWidth / domWidth >= scale) {
            this._setCanvasScale(canvasWidth, 1);
            return;
        }

        if (domWidth / canvasWidth >= scale) {
            const canvasScale = domWidth / canvasWidth;
            this._setCanvasScale(domWidth, canvasScale);
            return;
        }
    }

    // 设置 canvas 宽高及 scale 大小
    _setCanvasScale(canvasWidth, scale) {
        const {
            canvas,
            ctx
        } = this;

        canvas.width = canvasWidth;
        canvas.height = canvasWidth;

        ctx.scale(scale, scale);
    }

    // 改变画布颜色
    changeBackground(background) {
        this.canvas.style.background = background;
        return this;
    }

    // 改变画笔粗细
    changeBrushWidth(brushWidth) {
        this._backToBrush();
        this.ctx.lineWidth = brushWidth;
        return this;
    }

    // 改变画笔颜色
    changeBrushColor(brushColor) {
        this._backToBrush();
        this.ctx.strokeStyle = brushColor;
        return this;
    }

    // 橡皮擦
    eraser(width) {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = width;
        return this;
    }

    // 清空画布
    clearCanvas() {
        this._backToBrush();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }

    // 橡皮擦还原成画笔
    _backToBrush() {
        this.ctx.globalCompositeOperation = this.globalComposite;
    }

    // 画布生成图片
    canvasToImage(canvas = this.canvas) {
        return canvas.toDataURL('image/png');
    }

    // 画图
    drawImage(imageSrc, ctx = this.ctx, canvasWidth = this.canvasWidth) {
        if (!imageSrc) return;
        const compositeOperation = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'source-over';

        const canvasPic = new Image();
        canvasPic.src = imageSrc;

        return new Promise((resolve, reject) => {
            canvasPic.addEventListener('load', () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(canvasPic, 0, 0, canvasWidth, canvasWidth);

                ctx.globalCompositeOperation = compositeOperation;

                resolve(true);
            });
        });
    }

    // 生成带背景颜色的图片
    async canvasToImageWithBackground() {
        // 防止影响现有画布，所以copy一个出来
        const copyCanvas = this.canvas.cloneNode();
        const copyCtx = copyCanvas.getContext('2d');
        copyCanvas.id = 'copyCanvas';
        copyCanvas.style.display = 'none';
        document.body.appendChild(copyCanvas);

        const canvasWidth = copyCanvas.width;
        const compositeOperation = copyCtx.globalCompositeOperation;

        // 第一次生成不带背景色的图片
        const canvasImage = this.canvasToImage();

        await this.drawImage(canvasImage, copyCtx, canvasWidth);

        // 绘制背景色
        copyCtx.globalCompositeOperation = 'destination-over';
        copyCtx.fillStyle = this.canvas.style.background;
        copyCtx.fillRect(0, 0, canvasWidth, canvasWidth);

        // 第二次生成只有背景色的图片
        const imageData = this.canvasToImage(copyCanvas);

        // 将第一次生成的不带背景色的图片绘制到第二次生成只有背景色的图片之上
        this.drawImage(canvasImage, copyCtx);

        // 将globalCompositeOperation还原
        copyCtx.globalCompositeOperation = compositeOperation;

        document.body.removeChild(copyCanvas);
        return imageData;
    }

    // 画线
    drawLine(beginPoint, endPoint, controlPoint) {
        if (!beginPoint) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.moveTo(beginPoint[0], beginPoint[1]);

        // 1个点
        if (!controlPoint && !endPoint) {
            this.ctx.lineTo(beginPoint[0] + 0.01, beginPoint[1] + 0.01);
        }

        // 2个点
        if (!controlPoint && endPoint) {
            this.ctx.lineTo(endPoint[0], endPoint[1]);
        }

        // 3个点及以上
        if (controlPoint) {
            this.ctx.quadraticCurveTo(controlPoint[0], controlPoint[1], endPoint[0], endPoint[1]);
        }

        this.ctx.stroke();
        this.ctx.closePath();
    }

    // 绘制操作
    async drawData(paintRoute) {
        if (!paintRoute) return;

        const type = paintRoute.type;
        const linewidth = paintRoute.linewidth;
        const color = paintRoute.color;
        const path = paintRoute.path;

        const operations = () => {
            // 普通画笔
            const brush = () => {
                this.changeBrushWidth(linewidth);
                this.changeBrushColor(color);
                this._drawPath(path);
            };

            // 橡皮擦
            const eraser = () => {
                this.eraser(linewidth);
                this._drawPath(path);
            };

            // 画布颜色
            const background = () => {
                this.changeBackground(color);
            };

            // 清除画布
            const clear = () => {
                this.clearCanvas();
            };

            // 画图
            const drawImage = async() => {
                this.changeBackground(color);
                await this.drawImage(path);
            };

            return new Map([
                [1, brush],
                [2, eraser],
                [3, background],
                [6, clear],
                [7, drawImage]
            ]);
        };

        const operation = operations().get(type);
        await operation.call(this);
    }

    // 绘制一个操作 path 里的点; 解决单个点，两个点，多点的问题（普通画笔、橡皮擦）
    _drawPath(path) {
        let controlPoint = null;
        let endPoint = null;
        const length = path.length;

        if (length === 1) {
            this.drawLine(path[0]);
            return;
        }

        if (length === 2) {
            this.drawLine(path[0], path[1]);
            return;
        }

        path.map((item, index) => {
            // 最后两个点（直线：起点、终点）
            if (index >= path.length - 2) {
                endPoint = path[index + 1];
                this.drawLine(this.beginPoint, endPoint);

                // 其他点（贝塞尔：起点、终点、控制点）
            } else {
                index === 0 && (this.beginPoint = path[index]);
                controlPoint = path[index + 1];

                endPoint = [
                    (controlPoint[0] + path[index + 2][0]) / 2,
                    (controlPoint[1] + path[index + 2][1]) / 2
                ];

                this.drawLine(this.beginPoint, endPoint, controlPoint);
            }

            this.beginPoint = endPoint;
        });
    }
}

export default Board;
