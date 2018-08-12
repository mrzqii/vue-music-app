<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <!-- 这里的v-if是为了确保recommend的数据获取到了才开始渲染slider 因为recommend是异步获取到的
        在slider组件里面获取父级容器的宽度是必须等到所有列表都渲染进去了才能计算出来 -->
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" class="item" :key="index">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getRecommend,getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'

export default {
  data(){
    return {
      recommends: [],
      discList:[]
    }
  },
  methods:{
    // 获取推荐页 轮播图
    _getRecommend() {
      getRecommend().then((res) => {
        if(res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    // 获取推荐页 热门歌单推荐
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    // 这里轮播图片通过请求src地址才加载出来也是一个异步过程，这里就是为了保证
    // 图片加载出来了，盒子被撑开了，然后再refresh BS，避免发生scorll组件高度不够
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true
        // 这里调用了scroll组件里面的方法
        this.$refs.scroll.refresh()
      }
    }
  },
  created(){
    this._getRecommend()
    this._getDiscList()
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
   
 
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>