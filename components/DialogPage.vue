<template>
    <div class="dialog">
        <div class="content">
            <p>上次阅读到{{cfi}},是否继续</p>
        </div>
        <div class="button-group">
            <button class="comfirm">是的</button>
            <button class="cancel">从头开始</button>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        cfi:String
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.dialog{
    width: 100%;
    height: 100%;
    z-index: 200;
    background: red;
}
</style>
