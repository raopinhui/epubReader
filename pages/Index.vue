<template>
  <div class="ebook">
    <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow" :title="title" />
    <div class="read-wrapper">
      <div class="top">
        <span class='LTitle'>{{title}}</span>
      </div>
      <loading-page v-show="BookLoading" :loading="loading" />
      <!-- <dialog-page v-show="cfiIsShow" :cfi="cfi" /> -->
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center" @click="toggleTitleAndMenu"></div>
        <div class="right" @click="nextPage"></div>
      </div>
      <div class="bottom">
        <span class="location">
          {{location}}
        </span>
      </div>
    </div>
    <menu-bar :currentProgress="currentProgress" :themesList="themesList" :defaultThemes="defaultThemes" @setThemes="setThemes" @setFontSize="setFontSize" :fontSizeList="fontSizeList" :ifTitleAndMenuShow="ifTitleAndMenuShow" :defaultFontSize="defaultFontSize" :bookAvailable="bookAvailable" @bookAvailable="bookAvailable" @onProgressChange="onProgressChange" :navigation="navigation" @jumpTo="jumpTo" ref="menuBar" />

  </div>
</template>

<script>
import TitleBar from "@/components/TitleBar.vue";
import MenuBar from "@/components/MenuBar.vue";
import LoadingPage from "@/components/LoadingPage.vue";
// import DialogPage from "@/components/DialogPage.vue";
// import LoadingPageVue from "@/components/LoadingPage.vue";

import Epub from "epubjs";
import Axios from "axios";
import { log } from "util";


const DOWNLOAD_URL = "/static/2.epub";
global.ePub = Epub;

export default {
  name: "Ebook",
  data() {
    return {
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 }
      ],
      themesList: [
        {
          name: "default",
          style: {
            body: {
              color: "#000",
              background: "#fff"
            }
          }
        },
        {
          name: "eye",
          style: {
            body: {
              color: "#000",
              background: "#ceeaba"
            }
          }
        },
        // {
        //   name: "night",
        //   style: {
        //     body: {
        //       color: "#222",
        //       background: "#000"
        //     }
        //   }
        // },
        {
          name: "gold",
          style: {
            body: {
              color: "#000",
              background: "rgb(241,236,226)"
            }
          }
        }
      ],
      defaultThemes: 0,
      defaultFontSize: 12,
      bookAvailable: false,
      currentProgress: 0,
      title: "epubReader",
      ifTitleAndMenuShow: false,
      BookLoading: true,
      navigation: {},
      locationNum: 0,
      locationNumAll: 0,
      cfi: "",
      loaded: 0,
      total: 0,
      loading: "",
      cfiIsShow: true
    };
  },

  computed: {
    location: function() {
      if (this.locationNum == 0 || this.locationNumAll == 0) {
        return "加载中...";
      } else {
        return this.locationNum + "/" + this.locationNumAll;
      }
    }
  },
  components: {
    "title-bar": TitleBar,
    "menu-bar": MenuBar,
    "loading-page": LoadingPage,
    // "dialog-page":DialogPage
    // "dialog-read": Dialog
  },
  created() {
    
  },
  mounted() {
    this.showEpub();
    this.getLoadingForBook()
  },

  methods: {
    showEpub() {
      //1.生成book
      this.book = new Epub(DOWNLOAD_URL);

      //2.通过book.rederTo生成rendition对象
      this.rendition = this.book.renderTo("read", {
        //read 需要挂载的dom对象
        width: window.innerWidth,
        height: window.innerHeight,
        method: "default"
      });
  
      //3.通过Rendition.display渲染电子书
      const cfi = localStorage.getItem("cfi");
      if (cfi != null) {
        this.rendition.display(cfi).then(() => {
          this.showPage();
          this.setTitleAndPercentage();
        });
      }else{
        this.rendition.display().then(() => {
          this.showPage();
          this.setTitleAndPercentage();
        });
      }

      //获取theme对象
      this.themes = this.rendition.themes;
      //设置默认字体
      const fontSize= parseInt(localStorage.getItem('fontSize'))
      this.setFontSize(fontSize? fontSize:this.defaultFontSize);
      
      //注册主题列表
      this.registerTheme();

      //设置主题
      const themes = parseInt(localStorage.getItem('themes'))
      this.setThemes(themes? themes:this.defaultThemes);
      //获取location对象
      //通过epub.js的钩子函数来实现,电子书解析完成后会 回调的方法
      this.book.ready
        .then(() => {
          this.navigation = this.book.navigation;
          return this.book.locations.generate();
        })
        .then(result => {
          this.locations = this.book.locations;
          this.locationNumAll = this.locations.total;
          this.currentLocation = this.rendition.currentLocation();
          this.locationNum = this.currentLocation.end.location;
          this.bookAvailable = true;
        });
    },
    setCfiLocal() {
      localStorage.setItem("cfi", this.cfi);
    },
    //弹出菜单
    toggleTitleAndMenu() {
      this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow;
      if (!this.ifTitleAndMenuShow) {
        this.$refs.menuBar.hideSetting();
      }
    },

    //前一页
    prevPage() {
      //调用Rendition.prev
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.setTitleAndPercentage();
        });
      }
    },
    //后一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.setTitleAndPercentage();
        });
      }
    },
    setTitleAndPercentage() {
      const currentLocation = this.rendition.currentLocation();
      this.currentProgress = Math.round(currentLocation.end.percentage * 100);
      localStorage.setItem('currentProgress',this.currentProgress)
      const title = this.book.navigation.get(currentLocation.end.href);
      this.locationNum = currentLocation.end.location;
      this.title = title.label;
      this.cfi = currentLocation.end.cfi;
      if(this.cif!=='epubcfi(/6/2[id212]!/4/22[id_mbookmark2]/15:1)'){
        localStorage.setItem('cfi',this.cfi)
      }
      
    },
    // 设置字体
    setFontSize(fontSize) {
      this.defaultFontSize = fontSize;
      if (this.themes) {
        this.themes.fontSize(fontSize + "px");
        localStorage.setItem('fontSize',fontSize)
      }
      
    },
    // 主题设置
    registerTheme() {
      this.themesList.forEach(theme => {
        this.themes.register(theme.name, theme.style);
      });
    },
    setThemes(index) {
      this.defaultThemes = index;
      this.themes.select(this.themesList[index].name);
      localStorage.setItem('themes',index)
    },
    //进度条跳转
    onProgressChange(progress) {
      // progress 进度条数值 0-100
      const perentage = progress / 100;
      const location =
        perentage > 0 ? this.locations.cfiFromPercentage(perentage) : 0;
      this.rendition.display(location).then(() => {
        this.setTitleAndPercentage();
      });
    },
    //根据链接跳转到指定位置
    jumpTo(href) {
      this.rendition.display(href).then(() => {
        this.setTitleAndPercentage();
      });
      this.hideTitleAndMenu();
    },
    //隐藏显示标题栏和菜单栏
    hideTitleAndMenu() {
      //隐藏标题栏和菜单栏
      this.ifTitleAndMenuShow = false;
      //隐藏设置栏
      this.$refs.menuBar.hideSetting();
      //隐藏目录
      this.$refs.menuBar.hideContent();
    },
    //显示隐藏 加载页面
    showPage() {
      this.BookLoading = false;
    },
    //获得加载页面的进度
    getLoadingForBook() {
      var config = {
        onDownloadProgress: progressEvent => {
          var complete =
            (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
          this.loading = complete;
          console.log(this.loading)
        }
      };
      var l = Axios.get("static/HeatingBook1.1.epub", config).then(res => {
        if (res.data.status === "success") {
          console.log("下载完毕");
        }
      });
    }
    //电子书渲染
  }
};
</script>

<style  lang='scss'>
@import "@/assets/styles/global.scss";
.ebook {
  position: relative;
  .read-wrapper {
    .top {
      position: absolute;
      z-index: 99;
      top: 0;
      left: 0;
      height: 5%;
      font-size: px2rem(15);
      color: #cccccc;
      padding-left: px2rem(15);
    }
    .bottom {
      position: absolute;
      z-index: 101;
      bottom: 0;
      right: 0;
      color: #cccccc;
      height: 3%;
      font-size: px2rem(15);
      padding-right: px2rem(15);
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      //   background: yellow;
      display: flex;
      .left {
        flex: 0 0 px2rem(100);
        // background: yellow;
      }
      .center {
        flex: 1;
        //   background:red;
      }
      .right {
        flex: 0 0 px2rem(100);
        // background: orange;
      }
    }
  }
}
</style>
