import {playMode} from 'common/js/config'
const state = {
    singer: {},
    // 播放状态：暂停还是播放
    playing: false,
    // 播放器是否是全屏
    fullScreen: false,
    // 播放歌曲的列表
    playlist: [],
    // 随机播放列表
    sequenceList: [],
    // 播放的模式 （这样写是为了语义化）
    mode: playMode.sequence,
    // 当前播放歌曲在播放列表里面的索引值
    currentIndex: -1
  }
  
export default state