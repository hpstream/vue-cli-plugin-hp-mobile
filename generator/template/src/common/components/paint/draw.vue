/*
 * @Author: jojo 
 * @Date: 2019-07-13 18:03:00 
 * @Last Modified by: jojo
 * @Last Modified time: 2019-07-29 21:30:10
 * @Title：小画板组件
 * 实现思路：利用 touchstart、touchmove 和touchend 方法，拿到 touch 过程中点的坐标信息，用贝塞尔曲线实现绘制。
 * props：background（画布背景）、brushWidth（画笔粗细） 和 brushColor（画笔颜色）。
 * 提供的方法：选择画笔粗细、选择画笔颜色、橡皮擦、改变画布颜色、清除画布、撤销、恢复、获取绘画数据和生成带背景颜色的图片，具体实现详见 draw.js 文件。
 */

<template>
    <canvas
        class="canvas"
        :id="canvasName"
        :style="{background: background}"
        @touchstart.prevent="start"
        @touchmove.prevent="move"
        @touchend.prevent="end"
    ></canvas>
</template>

<script>
import Draw from "./canvas/draw";
import createOnlyId from './utils/create-only-id';

export default {
    data() {
        return {
            canvasName: createOnlyId()
        };
    },
    props: {
        //画布颜色
        background: {
            type: String,
            default: "#f7f9e3"
        },
        //画笔粗细
        brushWidth: {
            type: Number,
            default: 1
        },
        //画笔颜色
        brushColor: {
            type: String,
            default: "#000"
        }
    },
    mounted() {
        setTimeout(() => {
            this.draw = new Draw(this.canvasName, this);
        }, 0);
    },
    methods: {
        start(evt) {
            this.draw.start(evt);
        },
        move(evt) {
            this.draw.move(evt);
        },
        end(evt) {
            this.draw.end(evt);
        },
        selectOperation(type, props){
            var data = this.draw.selectOperation(type, props);
             return data;
        }
    }
};
</script>

<style lang="less" scoped>
.canvas {
    width: 100%;
    height: 100%;
}
</style>
