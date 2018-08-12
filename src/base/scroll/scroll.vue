<!-- 滚动组件 -->
<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
export default {
    props:{
        probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
  data () {
    return {
    };
  },

  

  methods: {
    //   初始化BS
      _initScroll(){
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        // 初始化BS的时候判断是否需要有监听这个scroll的滚动事件
        if(this.listenScroll) {
          // 这里需要保存vue实例
          let _this = this
          // 监听到滚动以后把滚动到的位置传到父级，便于后面左右联动
          this.scroll.on('scroll',(pos) => {
            _this.$emit('scroll', pos)
          })
        }
      },
    //   封装BS一些列的函数
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
  },

  mounted(){
    //   在组件挂载的时候初始化BS，但是数据都是异步获取的，在挂载的时候组件还没有接收到内容
    //   还没有把对应的节点撑开，所以需要从父组件传入data,然后通过观察data发生变化了再refresh
      this._initScroll()
  },
  watch: {
    //   观察props属性data发生变化的时候触发:因为
      data() {
          setTimeout(() => {
              this.refresh()
          }, this.refreshDelay)
      },
  }
}

</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
</style>