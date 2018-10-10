<template>
  <transition  name="slide-right">
    <div class="content">
      <div class="content-wrapper" v-if="bookAvailable">
        <!-- <transition name="slide-right"> -->
        <div class="content-item" v-for="(items, index) in navigation.toc" :key="index">
          <span v-if="items.subitems!=''" class="iconfont icon _toDown1" @click="setOpen(items.id)" :class="open==items.id && openOff?' icon-xiala':' icon-toDown'"></span>
          <span v-else class="iconfont icon icon-subtract _toDown1"></span>
          <span class="text" @click="jumpTo(items.href)">{{items.label}}</span>
          <div v-if="items.id==open && openOff" class="content-item" v-for="(item,index) in items.subitems" :key="index">
            <span v-if="item.subitems!=''" class="iconfont icon-toDown _toDown2" @click="setOpen2(item.id)" :class="open2==item.id && openOff2?' icon-xiala':' icon-toDown'"></span>
            <span v-else class="iconfont icon icon-subtract _toDown2"></span>
            <span class="text" @click="jumpTo(item.href)"> {{item.label}}</span>
            <div v-if="item.id == open2 && openOff2" class="content-item" v-for="(i,index) in item.subitems" :key="index">
              <span v-if="i.subitems!=''" class="iconfont icon-toDown icon _toDown3" @click="setOpen3(i.id)" :class="open3==i.id && openOff3?' icon-xiala':' icon-toDown'"></span>
              <span v-else class="iconfont icon icon-subtract _toDown3"></span>
              <span class="text" @click="jumpTo(i.href)"> {{i.label}}</span>
              <div v-if="i.id == open3 && openOff3" class="content-item" v-for="(t,index) in i.subitems" :key="index">
                <span class="iconfont icon icon-subtract _toDown4"></span>
                <span class="text" @click="jumpTo(t.href)"> {{t.label}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- </transition> -->
      </div>
      <div class="empty" v-else>加载中...</div>

    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      open: "",
      openOff: false,
      open2: "",
      openOff2: false,
      open3: "",
      openOff3: false,
      index: 0
    };
  },
  props: {
    ifShowContent: Boolean,
    navigation: Object,
    bookAvailable: Boolean
  },
  methods: {
    jumpTo(target) {
      this.$emit("jumpTo", target);
    },
    setOpen(index) {
      if (this.index != index) {
        this.openOff2 = false;
        this.openOff3 = false;
        this.openOff = false;
      }
      this.index = index;
      this.openOff = !this.openOff;
      this.open = index;
    },
    setOpen2(index) {
      if (this.index != index) {
        this.openOff2 = false;
        this.openOff3 = false;
      }
      this.openOff2 = !this.openOff2;
      this.open2 = index;
      this.index = index;
    },
    setOpen3(index) {
      if (this.index != index) {
        this.openOff3 = false;
      }
      this.index = index;
      this.openOff3 = !this.openOff3;
      this.open3 = index;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../assets/styles/global";
.content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 102;
  width: 80%;
  height: 100%;
  background: white;
  .content-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    .content-item {
      padding: px2rem(5) px2rem(5);
      border-bottom: px2rem(1) solid #f4f4f4;
      .text {
        padding: px2rem(20) px2rem(15);
        height: 100%;
        font-size: px2rem(12);
        color: #333;
      }
      ._toDown1 {
        // width: 30%;
        padding: px2rem(15) px2rem(5);
        height: 100%;
        font-size: px2rem(20);
      }
      ._toDown2 {
        // width: 30%;
        padding: px2rem(15) px2rem(10);
        height: 100%;
        font-size: px2rem(15);
      }
      ._toDown3 {
        // width: 30%
        padding: px2rem(15) px2rem(20);
        height: 100%;
        font-size: px2rem(10);
      }
      ._toDown4 {
        padding: px2rem(15) px2rem(30);
        height: 100%;
        font-size: px2rem(5);
      }
    }
  }
  .empty {
    width: 100%;
    height: 100%;
    @include center;
    font-size: px2rem(16);
    color: #333;
  }
}
</style>