<template>
  <div class="main">
    <el-container>
      <el-header height="125px">
        <div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllSplitElementsChange">换行标记</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="splitArrays" @change="handleCheckedSplitElementsChange">
            <el-checkbox v-for="element in splitElements" :label="element" :key="element">{{toString(element)}}</el-checkbox>
          </el-checkbox-group>
          <el-input v-model="maxLength" style="margin-top: 20px">
            <template slot="prepend">单行最大字数</template>
          </el-input>
        </div>
      </el-header>
      <el-main>
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
      </el-main>
    </el-container>


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
        isIndeterminate: true,
        checkAll: false,
        splitArrays: ['，', '。', '？', '\r', '\n', '！', '；', ',', '?', '!', ';'],
        splitElements: ['，', '。', '？', '\r', '\n', '！', '；', ',', '?', '!', ';', '.'],
        trimArr: ['*'],
        maxLength: 50
      }
    },
    methods: {
      handleCheckedSplitElementsChange (val) {
      },
      handleCheckAllSplitElementsChange (val) {
        this.splitArrays = val ? this.splitElements : []
        this.isIndeterminate = false
      },
      toString (item) {
        if (item === '\r') {
          return '"换行r"'
        } else if (item === '\n') {
          return '"换行n"'
        } else {
          return '"' + item + '"'
        }
      },
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
          } else if (tempStr.length > that.maxLength - 2) {
            tempStr += value
            textArrays.push(trim(tempStr))
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
  .el-header, .el-footer {
  }
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
