<template>
  <transition name="slide-down">
    <div class="title-wrapper" v-show="ifTitleAndMenuShow">
      <div class="center">{{title}}</div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
  data() {
    return {};
  },
  props: {
    ifTitleAndMenuShow: {
      type: Boolean,
      default: false
    },
    title: String
  },
  components: {}
};
</script>

<style  lang='scss' scoped>
@import "@/assets/styles/global.scss";
.title-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 101;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.15);
  // .left {
  //   flex: 0 0 px2rem(30);
  //   @include center;
  // }
  // .right {
  //   flex: 1;
  //   display: flex;
  //   justify-content: flex-end;
  //   font-size: px2rem(15);
  //    @include center;
  //   .icon-wrapper {
  //     flex: 0 0 px2rem(40);
  //     @include center;
  //   }
  // }
  .center {
    flex: 1;
    font-size: px2rem(18);
    @include center;
  }
}
</style>
