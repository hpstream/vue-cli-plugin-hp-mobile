/*
 * @Author: jojo 
 * @Date: 2019-07-13 18:03:00 
 * @Last Modified by: jojo
 * @Last Modified time: 2019-07-25 18:23:23
 * @Title：画猜回放组件
 * 实现思路：拿到外部传进来的数据 paintInfo 进行解析处理，包括普通画笔、橡皮擦、改变画布背景色、撤销、恢复和清除画布，同时将当前时间和回放总时间暴露出去。
 * props：background、paintInfo。
 * 提供的方法：播放、暂停、继续播放、重置、改变速度，具体实现详见 play.js 文件。
 */

<template>
    <canvas class="canvas" 
        :id="this.canvasName"
        :style="{background: background}"
    ></canvas>
</template>

<script>
import createOnlyId from "./utils/create-only-id";
import Play from './canvas/play';

export default {
    data(){
        return {
            canvasName: createOnlyId()
        }
    },
    props: {
        //绘画信息
        paintInfo: {
            type: Array,
            default: function () {
                return []
            }
        },
        //画布颜色
        background: {
            type: String,
            default: "#f7f9e3"
        }
    },
    watch: {
        //监听 paintInfo 变化
        paintInfo(val) {
            if(val.length === 0) return;
            this.play = new Play(this.canvasName, this, val);
        }
    },
    methods: {
        selectOperation(type, props){
            this.play.selectOperation(type, props);
        }
    }
}
</script>

<style lang="less" scoped>
.canvas {
    width: 100%;
    height: 100%;
}
</style>
