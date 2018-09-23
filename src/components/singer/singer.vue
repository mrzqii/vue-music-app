<template>
  <div class="singer">
    <list-view @select="selectSinger" :data="singers"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import listView from 'base/listview/listview'
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import {mapMutations} from 'vuex' //vuex自带的语法糖

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
export default {
   
  data(){
    return {
      singers:[]
    }
  },
  methods:{
    selectSinger(singer){
      this.$router.push({
          path: `/singer/${singer.id}`
        })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
           
            // console.log(1,this.singers)
          }
        })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          item : []
        }
      }
      list.forEach((item, index) => {
        if(index < HOT_SINGER_LEN) {
          map.hot.item.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        if(!map[key] ){
          map[key] = {
            title: key,
            item : []
          }
        }
        map[key].item.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      });
      let ret = []
      let hot = []
      for(let key in map){
        let val = map[key]
        if(val.title.match(/[a-zA-Z]/)){
          ret.push(val)
        }else if(val.title===HOT_NAME){
          hot.push(val)
        }
      }
      ret.sort((a,b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    // 你可以在组件中使用 this.$store.commit('xxx') 提交 mutation，或者使用 mapMutations 
    // 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）。
    ...mapMutations({
        setSinger: 'SET_SINGER'
      })
  },
  created(){
    this._getSingerList()
  },
  components:{
    listView
  }
   
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
      position: fixed
      top: 88px
      bottom: 0
      width: 100%
</style>