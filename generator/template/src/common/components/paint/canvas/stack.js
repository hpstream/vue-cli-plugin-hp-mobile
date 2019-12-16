// 该文件主要用作数据存储，主要是存储一系列的操作
// 存储操作分为2种，1种是传给服务端的数据，也就是下面的 paintInfo 变量，该变量是所有操作都存储，包括普通画笔、橡皮擦、画布颜色、撤销、恢复和清空画布这6种
// 而另外1种则是为了撤销恢复存储的数据，也就是下面的 operations 和 operationsReplace 变量，operationsReplace 是 operations 的副本，主要是恢复时需要使用，但只需要存储普通画笔、橡皮擦、画布颜色和清空画布这4种
// 撤销恢复的思路：每 100 笔存储一张截图，其余存储具体操作，所以撤销的时候，只需要找到最近的截图加后面的操作，重绘完就可以了，这样性能比较好，也不会特别耗内存

class Stack {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');

        this.init();
    }

    init() {
        // 传给服务端的数据
        this.paintI = -1;
        this.paintInfo = [];

        // 处理撤销恢复的数据
        this.operationI = -1;
        this.operations = [{
            type: 3,
            color: this.canvas.style.background,
            path: [],
            linewidth: this.ctx.lineWidth,
            width: this.canvas.offsetWidth
        }];
        this.operationsReplace = [];
    }

    // 保存每个操作
    saveOperation(type, params) {
        const operation = this._getOperationObj(type, params);

        this.paintI++;
        this.paintInfo.push(operation);

        // 排除撤销、恢复操作
        if (operation.type != 4 && operation.type != 5) {
            this.operationI++;

            const operationCopy = Object.assign({}, operation);

            // 每100笔存一张图
            if (this.operationI > 0 && this.operationI % 101 === 0) {
                operationCopy.path = this.canvas.toDataURL('image/png');
                operationCopy.type = 7;
                operationCopy.color = this.canvas.style.background;
            }
            this.operations.push(operationCopy);
            this.operationsReplace = this.operations.concat();
        }
    }

    // 获取一个完整的操作对象
    _getOperationObj(type, params) {
        // 普通画笔or橡皮擦，params是路径，其余操作为空数组
        const routePath = (type === 1 || type === 2) ? params : [];

        // 3是画布颜色，其他是画笔颜色
        const color = (type === 3) ? this.canvas.style.background : this.ctx.strokeStyle;

        const routeObj = {
            color: color,
            linewidth: this.ctx.lineWidth,
            path: routePath,
            type: type,
            width: this.canvas.offsetWidth
        };

        return routeObj;
    }

    // 获取总数据
    getPaintInfo() {
        return this.paintInfo;
    }

    // 获取撤销数据
    getUndoData() {
        if (this.operations.length === 1) return [];

        this.operationI--;
        this.operations.pop();

        // 截取最近的截图+操作
        const resultOperations = [];

        for (let i = this.operations.length - 1; i >= 0; i--) {
            resultOperations.unshift(this.operations[i]);

            // 找到截图就停止
            if (this.operations[i].type === 7) {
                break;
            }
        }

        return resultOperations;
    }

    // 获取恢复数据
    getRedoData() {
        const operationsLength = this.operations.length;
        const operationsReplace = this.operationsReplace.length;

        if (operationsLength === operationsReplace) return this.operationsReplace[operationsReplace - 1];

        this.operationI++;

        const redoData = this.operationsReplace[operationsLength];
        this.operations.push(redoData);

        return redoData;
    }
}

export default Stack;
