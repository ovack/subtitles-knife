<template>
  <div class="autoline-main">
    <div class="content-area">
      <el-input
        type="textarea"
        :rows="20"
        placeholder="请输入需要换行的文本"
        v-model="handletext">
      </el-input>
    </div>
    <div class="tool-area">
      <el-button type="primary" round @click="processBtnClick">处理</el-button>
    </div>
    <div class="content-area">
      <el-input
        type="textarea"
        :rows="20"
        placeholder="请在左侧输入需要换行的文本"
        v-model="newtext">
      </el-input>
    </div>

  </div>
</template>

<script>
  import { each, join, trim } from 'lodash'
  export default {
    data () {
      return {
        handletext: '',
        newtext: '',
        electron: process.versions.electron,
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version,
        textArrays: [],
        splitArrays: ['，', '。', '？', '\r', '\n', '！', '；', ',', '?', '!', ';'],
        trimArr: ['*']
      }
    },
    methods: {
      processBtnClick () {
        let that = this
        that.newtext = 'handled'
        // console.log(this.handletext)
        that.newtext = ''
        let textArrays = []
        let tempStr = ''
        each(that.handletext, function (value, index) {
          if (that.splitArrays.includes(value)) {
            if (tempStr.length > 0) {
              textArrays.push(trim(tempStr))
            }
            tempStr = ''
          } else {
            if (!that.trimArr.includes(value)) {
              tempStr += value
            }
          }
        })
        if (tempStr.length > 0) {
          textArrays.push(trim(tempStr))
        }
        that.newtext = join(textArrays, '\n')
      }
    }
  }
</script>

<style scoped lang="scss">
  .autoline-main {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content-area {
    height: 100%;
    width: 40%;
  }
  .tool-area {
    width: 15%;
    height: 100%;
    text-align: center;
  }
</style>
