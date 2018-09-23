<!-- 歌手页面 歌手滚动区域 -->
<template>
  <scroll   :listen-scroll="listenScroll" 
            @scroll="scroll"
            :data="data"
            :probe-type="probeType"
            class="listview"
            ref="listview">
    <ul>
      <li v-for="(group, index) in data" class="list-group" ref="listGroup" :key="index">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="(item, index) in group.item" class="list-group-item" :key="index">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" 
        @touchstart="onShortcutTouchStart" 
        @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" 
            :data-index="index" 
            class="item"
            :key="index"
            :class="{'current':currentIndex===index}">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" >
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type='text/ecmascript-6'>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18
export default {
  data () {
    return {
        scrollY:-1,
        currentIndex:0
    };
  },
  props:{
      data:{
          type:Array,
          default:[]
      }
  },
  components: {
    Scroll,
    Loading
  },
  created() {
    //   这里不把这个属性初始化在data里面就是因为：我们这个数据是不需要给DOM绑定在一起，不需要实现数据的双向绑定
    //   不需要设置get/set 来对数据进行观察
      this.touch = {},
      this.listenScroll = true,
      this.listHeight = [],
    //   这个参数是配置BS的 支持滑动swipe
      this.probeType = 3
  },
  methods:{
    //   点击右边导航左边的歌手列表联动
      onShortcutTouchStart(e){
        //   获得当前点击元素的索引值
          let anchorIndex = getData(e.target, 'index')
        // 通过这个操作就能获取到第一次点击的各种数据
          let firstTouch = e.touches[0]
        //   获取点上去的时候当前的坐标Y值，后面touchmove的时候需要用到
          this.touch.y1 = firstTouch.pageY
          this.touch.anchorIndex = anchorIndex
        //   左边歌手列表跳转 0那个参数动画的时间
          this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e){
          let firstTouch = e.touches[0]
          this.touch.y2 = firstTouch.pageY
        //   后面的|0 表示向下取整，Math.floor一个作用
          let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
          let anchorIndex = parseInt(this.touch.anchorIndex) + delta
          this._scrollTo(anchorIndex)
      },
    //   接收到子组件scroll传过来的数据，然后把保存到scrollY里面
      scroll(pos){
        //   pos: {x: 0, y: -799.461} 这个pos是BS里面封装的
          this.scrollY = pos.y
      },
    //   点击歌手名字派发事件，传递参数
      selectItem(item){
          this.$emit('select',item)
      },
      _scrollTo(index){
        //   这几个判断是对索引边界的判断，shuyouyouhu范畴，当索引超过范围值，就不执行
          if (!index && index !== 0) {
            return
          }
          if (index < 0) {
            index = 0
          } else if (index > this.listHeight.length - 2) {
            index = this.listHeight.length - 2
          }
        //   如果不写这段，点击右边，字母不会高亮，因为逻辑是currentIndex是依赖scrollY的
        //   scrollY是通过左边的滚动派发事件得到的值
          this.scrollY = -this.listHeight[index]
          this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight(){
          this.listHeight = []
          const list = this.$refs.listGroup
          let height = 0
          this.listHeight.push(height)
          for(let i=0;i<list.length;i++){
              let item=list[i]
              height += item.clientHeight
              this.listHeight.push(height)
          }
        //   this.listHeight:[0, 760, 1030, 1370,.....]
          

      }
  },
  watch:{
      data(){
        //   观察到数据变化的时候计算高度，使用setTimeout因为：数据变化到渲染出来还是需要时间的
        //   为了兼容性没有使用nextstic()方法
          setTimeout( () => {
              this._calculateHeight()
          },20)
      },
    //   有两个参数，第一个是新的值，第二个是旧的值
      scrollY(newY,oldY){
          const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
          if (newY > 0) {
            this.currentIndex = 0
            return
           }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            // this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      }
  },
  
  computed: {
      shortcutList(){
        //   map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。
        return this.data.map((group) => {
            return group.title.substr(0,1)
        })
      },
      fixedTitle() {
          if(this.scrollY > 0){
              return ''
          }
          return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
  },
}
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
    @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>