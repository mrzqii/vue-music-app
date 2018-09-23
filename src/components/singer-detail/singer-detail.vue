<!-- 歌手详细组件 -->
<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type='text/ecmascript-6'>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data () {
    return {
        songs:[]
    };
  },

//   components: {},

  computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
    //   mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性
    ...mapGetters([
    'singer'
    ])
  },
  created() {
    this._getDetail()
  },

//   mounted: {},

  methods: {
      _getDetail() {
          if(!this.singer.id) {
              this.$router.push('/singer')
              return
          }
          getSingerDetail(this.singer.id).then((res) => {
              if(res.code === ERR_OK) {
                
                  
                  this.songs = this._normalizeSongs(res.data.list)
                console.log('this.songs:',this.songs);
                
                  
              }
          })
      },
    //   处理数据的函数，处理为我们需要的格式
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
            // 对象的解构赋值：
            // let { foo, bar } = { foo: "aaa", bar: "bbb" };
            // foo // "aaa"
            // bar // "bbb
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
  },
  components: {
      MusicList
  }
}

</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
    @import "~common/stylus/variable"
    .singer-detail  
        position fixed
        z-index 100
        top 0
        left 0
        right 0
        bottom 0
        background $color-background
    
    .slide-enter-active,.slide-leave-active 
        transition all 0.3s
    .slide-enter,.slide-leave-to 
        transform translate3d(100%, 0, 0)
    
</style>