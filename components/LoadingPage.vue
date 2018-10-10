<template>
  <div class="book-loading ">
    <div class="loading-content">
      <div class="loading-logo iconfont icon icon-smile"></div>
      <div class="loading-text">正在加载图书，请稍等...{{loading}}</div>
      <div class="loading-label">（若是第一次加载，需要下载图书，下载时间视网络情况而定，约1分钟左右）</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    loading: String
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/global.scss";
.book-loading {
  width: 100%;
  height: 100%;
  z-index: 103;
  .loading-content {
    position: absolute;
    top: 20%;
    text-align: center;
    margin: px2rem(30);
    .loading-logo {
      font-size: px2rem(120);
      margin: px2rem(15);
    }
    .loading-text {
      margin: px2rem(15);
      font-size: px2rem(20);
    }
    .loading-label {
      margin: px2rem(15);
      font-size: px2rem(15);
    }
  }
 
}
</style>
