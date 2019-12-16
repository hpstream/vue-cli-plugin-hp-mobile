// 回放，为 play.vue 服务
// 一个完整的数据分为6种操作：普通画笔、橡皮擦、画布颜色、撤销、恢复和清空画布
// 当拿到一个完整的数据进行回放的时候，将数据拆分成2类，1类是普通画笔和橡皮擦这种，需要深入解析path进行回放的操作，1类就是其他操作，可以直接进行绘制。

import Draw from './deal-data';
class Play {
    constructor(id, context) {
        this.context = context;

        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.timer = null;
        this.positon = [0, 0];
        this.paintInfo = context.paintInfo;
        this.currentAframe = 0;
        this.currentTime = 0;
        this.speed = 30;

        this._initPaintInfo();
        this._calculateSumTime();

        this.draw = new Draw(id, context, this.paintInfo[0].width);
    }

    // 初始化 paintInfo，主要是为了解决 width 不同问题
    _initPaintInfo() {
        const width = this.paintInfo[0].width;

        this.paintInfo.map(paintItem => {
            if (paintItem.width != width) {
                const radio = width / paintItem.width;
                paintItem.width = width;

                if (paintItem.type <= 2) {
                    paintItem.path.map(item => {
                        item[0] = item[0] * radio;
                        item[1] = item[1] * radio;
                    });
                }
            }
        });
    }

    // 计算总时间
    _calculateSumTime() {
        let sumtime = 0;

        this.context.paintInfo.map(item => {
            if (item.type <= 2) {
                (item.path.length <= 2) && (sumtime += 1);
                (item.path.length >= 3) && (sumtime += item.path.length - 1);
            } else {
                sumtime += 1;
            }
        });

        this.context.$emit('sumtime', sumtime);
    }

    // 获取播放时间
    _getCurrentTime() {
        this.currentTime++;
        this.context.$emit('currenttime', this.currentTime);
    }

    // 播放
    playBack() {
        this.reset();
        this._playStream(this._handerAframe.bind(this));
    }

    // 制造播放流，获取一帧一帧的数据进行播放
    _playStream(successcb, currentAframe = 0, pathIndex = 0) {
        let i = currentAframe || 0;// 当前帧
        let j = pathIndex || -1;// path里的当前位置
        let paths = [];
        let BeginPoint = null;

        const {
            paintInfo
        } = this;

        const nextJ = () => {
            // 推动 path
            j++;

            // 一帧播放完毕触发 nextI
            if (j === paths.length - 1) {
                j = -1;
                i++;
                BeginPoint = null;
                return nextI();
            }

            const beginPoint = BeginPoint || paths[0];
            let controlPoint = paths[j + 1];
            let endPoint = null;
            if (paths[j + 2]) {
                endPoint = [
                    (controlPoint[0] + paths[j + 2][0]) / 2,
                    (controlPoint[1] + paths[j + 2][1]) / 2
                ];
            } else {
                endPoint = controlPoint;
                controlPoint = null;
            }

            const handerData = {
                i,
                j,
                beginPoint,
                controlPoint,
                endPoint
            };

            BeginPoint = endPoint;
            successcb && successcb(handerData, nextJ);
        };

        const nextI = async() => {
            if (!paintInfo[i]) return;

            const { path, type } = paintInfo[i];

            // 除去普通画笔和橡皮擦以外的操作，直接走 nextI，处理完每个操作
            if (type > 2) {
                await this._keyFrame(paintInfo[i]);

                if (type === 3 || type === 6) {
                    this.draw.saveOperation(type, path, paintInfo[i]);
                }

                this._getCurrentTime();
                i++;
                return nextI();
            }

            // 普通画笔和橡皮擦走 nextJ
            paths = path;
            this.draw.saveOperation(type, path, paintInfo[i]);
            return nextJ();
        };

        nextI();
    }

    // 处理播放逻辑（只有普通画笔和橡皮擦会走到这里）
    async _handerAframe(data, next) {
        const { i, j, beginPoint, controlPoint, endPoint } = data;

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this._getCurrentTime();
            this.positon = [i, j];
            this.draw.drawLine(beginPoint, endPoint, controlPoint);
            next();
        }, this.speed);
    }

    // 处理每个操作帧
    async _keyFrame(data) {
        if (!data) return;

        const { type } = data;

        const {
            undo,
            redo,
            drawData
        } = this.draw;

        // 撤销、恢复，其他操作直接走 draw.js 的 drawData 处理
        const typeObj = {
            4: undo,
            5: redo,
            'default': drawData
        };

        const fn = typeObj[type] || typeObj['default'];
        await fn.call(this.draw, data);
    }

    // 暂停
    pause() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    // 继续播放
    goon() {
        if (!this.timer) {
            this._playStream(this._handerAframe.bind(this), this.positon[0], this.positon[1]);
        }
    }

    // 重置
    reset() {
        clearTimeout(this.timer);
        this.timer = null;
        this.draw.clear();
        this.currentTime = 0;
        this.context.$emit('currenttime', 0);
        this.canvas.style.background = this.context.background;
        this.ctx.globalCompositeOperation = 'source-over';
        this.draw.initStack();
    }

    // 改变速度
    changeSpeed(multiple) {
        this.speed = this.speed / multiple;
    }

    // 选择操作
    selectOperation(type, props) {
        const {
            playBack,
            pause,
            goon,
            reset,
            changeSpeed
        } = this;

        const map = new Map([
            [1, playBack],
            [2, pause],
            [3, goon],
            [4, reset],
            [5, changeSpeed]
        ]);

        const operation = map.get(type);
        return operation.call(this);
    }
}

export default Play;
