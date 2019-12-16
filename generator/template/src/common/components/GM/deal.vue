<template>
  <ul class="deal">
      <p class="title">{{title}}</p>
      <li class="deal-li">
          <p>请选择处理方式</p>
          <ul>
              <li v-for="item in dealWay" @click="dealWayFun(item.id)">
                  <img class="deal-li__radio" v-if="item.ifCheck" src="./img/radio-checked.png">
                  <img class="deal-li__radio" v-else src="./img/radio-unchecked.png">
                  <span v-text="item.name"></span>
              </li>
          </ul>
      </li>
      <li class="deal-li" v-if="dealTime.length > 0">
          <p>请选择时间</p>
          <ul>
              <li v-for="item in dealTime" @click="dealTimeFun(item.id)">
                  <img class="deal-li__radio" v-if="item.ifCheck" src="./img/radio-checked.png">
                  <img class="deal-li__radio" v-else src="./img/radio-unchecked.png">
                  <span v-text="item.name"></span>
              </li>
          </ul>
      </li>
      <li class="deal-li" v-if="dealTime.length > 0">
          <p>请输入理由</p>
          <textarea class="deal-li__textarea" v-model.trim="reason"></textarea>
      </li>
  </ul>
</template>

<style lang="less" scoped>
.deal {
    padding: .373333rem; //14px
    background: #fff;

    .deal-li {
        margin-bottom: .373333rem;//14px

        &:last-child {
            margin-bottom: 0;
        }

        p {
            font-size: .32rem;//12px
        }

        ul {
            display: flex;
            width: 10rem;//375px
            height: .8rem;
            margin-left: -.373333rem;//-14px
            color: #333;

            li {
                display: flex;
                align-items: center;
                box-sizing: border-box;
                width: 25%;
                height: 100%;
                padding-left: .4rem;//15px

                .deal-li__radio {
                    width: .48rem;//18px
                    height: .48rem;
                    margin-right: .16rem;//6px
                }

                &:nth-child(2) {
                    padding-left: .266667rem;
                }
            }
        }

        .deal-li__textarea {
            box-sizing: border-box;
            width: 100%;
            height: 1.6rem;//60px
            padding: .266667rem .373333rem; //10px 14px
            margin-top: .373333rem; //14px
            border: 0;
            border-radius: .16rem; //6
            resize: none;
            font-size: .373333rem; //14px
            background: #f2f2f2;
        }
    }
}
</style>

<script>
export default {
  name: "deal",
  props:{
    title:{
      default: "违规处理"
    },
    //1:违规处理，2:用户处理
    type:{
      default: 1
    }
  },
  data(){
    return {
      reason: null,
      //处理方式
      dealWay: [{
          name: "不处理",
          ifCheck: true,
          status: false,
          id: 1
      }, {
          name: "冻结",
          ifCheck: false,
          status: "frozen",
          id: 2
      }, {
          name: "隔离",
          ifCheck: false,
          status: "isolation",
          id: 3
      }, {
          name: "禁言",
          ifCheck: false,
          status: "mute",
          id: 4
      }],
      dealWayName: "不处理",
      //处理时间
      dealTimeCopy: [{
          name: "1天",
          second: 86400,
          ifCheck: false,
          id: 1
      }, {
          name: "7天",
          second: 604800,
          ifCheck: false,
          id: 2
      }, {
          name: "30天",
          second: 2592000,
          ifCheck: false,
          id: 3
      }, {
          name: "永久",
          second: 311040000,
          ifCheck: false,
          id: 4
      }],
      dealTime:[],
      dealTimeName: "永久",
      operateParams: {
          status: false, //mute:禁言 isolation :隔离
          suspend: 1, //1封禁、0解封
          reason: null, //封禁原因
          second: null //封禁时间传秒
      },
      freezenParams: {
          reason: null //冻结原因
      }
    }
  },
  mounted() {
    if(this.type === 2){
      this.dealWay.pop();

      this.dealWay.splice(1,0,{
          name: "踢出房间",
          status: "kick",
          ifCheck: false,
          id: 5
      })
    }
  },
  methods: {
    //选择处理方式
    dealWayFun(clickId) {
        if (clickId === 2) {
            this.dealTime = Object.assign([], this.dealTimeCopy.slice(3));
        } else if (clickId === 1 || clickId === 5) {
            this.dealTime = Object.assign([], this.dealTimeCopy.slice(4));
        } else {
            this.dealTime = Object.assign([], this.dealTimeCopy);
        }

        //处理方式
        this.dealWay.map((item, index) => {
            if (item.id === clickId) {
                this.operateParams.status = item.status;
                this.dealWayName = item.name;
                Vue.set(item, "ifCheck", true);

                this.$emit("dealway", this.operateParams.status);
            } else {
                Vue.set(item, "ifCheck", false);
            }
        })

        //处理时间
        this.dealTime.map((item, index) => {
            if (item.id === 4) {
                this.operateParams.second = item.second;
                this.dealTimeName = item.name;
                Vue.set(item, "ifCheck", true);
            } else {
                Vue.set(item, "ifCheck", false);
            }
        })
    },
    //选择时间
    dealTimeFun(clickId) {
      if (this.operateParams.status) {
          this.dealTime.map((item, index) => {
              if (item.id === clickId) {
                  this.operateParams.second = item.second;
                  this.dealTimeName = item.name;
                  Vue.set(item, "ifCheck", true);
              } else {
                  Vue.set(item, "ifCheck", false);
              }
          })
      }
    },
    //获取操作参数
    getOperateParams(){
      if (this.operateParams.status === "frozen"){ //冻结
        this.freezenParams.reason = this.reason;
        return {
            operateParams: this.freezenParams,
            dealWayName: this.dealWayName,
            dealTimeName: this.dealTimeName
        };
      }else{
        this.operateParams.reason = this.reason;
        return {
            operateParams: this.operateParams,
            dealWayName: this.dealWayName,
            dealTimeName: this.dealTimeName
        };
      }
    }
  }
}
</script>


