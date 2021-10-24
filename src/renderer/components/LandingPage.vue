<template>
  <div class="wrapper">
    <el-container >
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" class="el-tab-main">
        <el-tab-pane label="字幕处理" name="handleSubtitle">
          <handle-sub-titles class=""> </handle-sub-titles>
        </el-tab-pane>
        <el-tab-pane label="自动换行" name="autoWarp">
          <auto-line-warp></auto-line-warp>

        </el-tab-pane>
      </el-tabs>
    </el-container>

  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import HandleSubTitles from './Tools/HandleSubTitles.vue'
  import AutoLineWarp from './Tools/AutoLineWarp.vue'

  export default {
    name: 'landing-page',
    components: { SystemInformation, HandleSubTitles, AutoLineWarp },
    data () {
      return {
        activeName: 'handleSubtitle',
        activeIndex: '1',
        activeIndex2: '1'
      }
    },
    created: function () {
      // `this` points to the vm instance
      this.activeName = 'handleSubtitle'
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClick (value) {
        console.log(value)
      }
    }
  }
</script>

<style lang="scss">
  .wrapper {
    width: 100%;
    background-color: #545c64;
  }
  .el-tab-main {
    width: 100%;
    height: 100%;
    border: 1px solid #eee
  }
  .dropzone-main {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .dropzone-content {
    text-align: center;
  }
</style>
