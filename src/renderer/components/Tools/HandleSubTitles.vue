<template>
  <div class="main">
    <div class="dropzone-container">
      <el-upload
        ref="handleFile"
        class="upload-demo"
        drag
        action=""
        accept=".json"
        :multiple="false"
        :auto-upload="true"
        :http-request="handleFile"
        :file-list="fileList"
        :limit="1"
        :on-exceed='uploadExceed'
        :on-remove="fileRemove"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
        
        <div class="el-upload__tip" slot="tip">json文件一般位于: /Users/[用户名]/Movies/JianyingPro/User Data/Projects/com.lveditor.draf/[项目名称]/draft_info.json</div>
      </el-upload>
    </div>
    <el-divider></el-divider>

    <div class="tool-area">
      <el-button class="btn-class" type="primary" round @click="processBtnClick" :disabled="jsonFile === ''">处理</el-button>
      <el-button class="btn-class" type="primary" round @click="downLoadSrt" :disabled="!hasSubtitles">下载</el-button>
    </div>
    
    <el-divider></el-divider>

    <div class="output-area">
      <el-input
        type="textarea"
        class="output-textarea"
        :autosize="{ minRows: 2, maxRows: 20}"
        placeholder="点击处理后显示字幕预览"
        v-model="cnText">
      </el-input>
    
      <el-input
        type="textarea"
        class="output-textarea"
        :autosize="{ minRows: 2, maxRows: 20}"
        placeholder="点击处理后显示字幕预览"
        v-model="hkText">
      </el-input>
    </div>
  </div>
</template>

<script>
  import fs from 'fs'
  const OpenCC = require('opencc-js')
  export default {
    data () {
      return {
        fileList: [],
        jsonFile: '',
        cnText: '',
        hkText: '',
        hasSubtitles: false
      }
    },
    methods: {
      uploadExceed (files, fileList) {
        this.$set(fileList[0], 'raw', files[0])
        this.$set(fileList[0], 'name', files[0].name)
        this.jsonFile = files[0]
        this.$refs['handleFile'].clearFiles()
        this.$refs['handleFile'].handleStart(files[0])
      },
      fileRemove (file, fileList) {
        this.jsonFile = ''
      },
      handleFile (value) {
        this.jsonFile = value.file
      },
      downLoadSrt () {
        let cnFilename = '简体.srt'
        let hkFilename = '繁体.srt'
        this.save(cnFilename, this.cnText)
        this.save(hkFilename, this.hkText)
      },
      save (filename, content) {
        let blob = new Blob([content], {type: 'application/json'})
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, filename)
        } else {
          let elem = window.document.createElement('a')
          elem.href = window.URL.createObjectURL(blob)
          elem.download = filename
          document.body.appendChild(elem)
          elem.click()
          document.body.removeChild(elem)
        }
      },
      processBtnClick () {
        console.log('handle process')
        let rawdata = fs.readFileSync(this.jsonFile.path)
        let cnSubtitles = JSON.parse(rawdata)
        let hkSubtitles = JSON.parse(rawdata)

        const cnConverter = OpenCC.Converter({ from: 'hk', to: 'cn' })
        const hkConverter = OpenCC.Converter({ from: 'cn', to: 'hk' })

        cnSubtitles.materials.texts.forEach(function (value, i) {
          cnSubtitles.materials.texts[i].content = cnConverter(value.content)
        })
        hkSubtitles.materials.texts.forEach(function (value, i) {
          hkSubtitles.materials.texts[i].content = hkConverter(value.content)
        })

        let handledSRTCN = this.convertToSRT(cnSubtitles)
        let handledSRTHK = this.convertToSRT(hkSubtitles)
        if (Object.keys(handledSRTCN).length <= 0) {
          this.hasSubtitles = false
          this.$message({
            message: '无字幕!',
            type: 'warning'
          })
        } else {
          this.hasSubtitles = true
          this.cnText = handledSRTCN[Object.keys(handledSRTCN)[0]]
          this.hkText = handledSRTHK[Object.keys(handledSRTHK)[0]]
          // console.log(outMap[Object.keys(outMap)[0]])
        }
      },
      convertToSRT (subtitles) {
        let texts = {}
        let temp = subtitles.materials.texts
        for (let i in temp) {
          texts[temp[i].id] = temp[i].content
        }
        let tracks = subtitles.tracks
        let track = ''
        let srtFiles = {}
        for (let i in tracks) {
          track = tracks[i]
          temp = this.convertTrack2Srt(track, texts)
          if (temp) {
            srtFiles[track.id] = temp
          }
        }
        return srtFiles
      },
      convertTrack2Srt (track, texts) {
        let segments = track.segments
        let segment = ''
        let srt = {content: null, start: null, end: null}
        let srtText = ''
        let index = 0
        for (let i in segments) {
          segment = segments[i]
          srt.content = texts[segment.material_id]
          if (!srt.content) continue
          srt.start = segment.target_timerange.start
          srt.end = srt.start + segment.target_timerange.duration
          srt.start = this.getSrtTimeText(srt.start)
          srt.end = this.getSrtTimeText(srt.end)
          index++
          srtText += this.formatSrt(index, srt)
        }
        return srtText
      },
      formatDigit (digit, length) {
        let str = digit.toString()
        while (str.length < length) {
          str = '0' + str
        }
        return str
      },
      getSrtTimeText (time) {
        time = Math.floor(time / 1000)
        let millisecond = time % 1000
        time = Math.floor(time / 1000)
        let second = time % 60
        time = Math.floor(time / 60)
        let minute = time % 60
        time = Math.floor(time / 60)
        let hour = time
        hour = this.formatDigit(hour, 2)
        minute = this.formatDigit(minute, 2)
        second = this.formatDigit(second, 2)
        millisecond = this.formatDigit(millisecond, 3)
        return hour + ':' + minute + ':' + second + ',' + millisecond
      },
      formatSrt (index, srt) {
        let warp = '\r\n'
        return index + warp + srt.start + ' --> ' + srt.end + warp + srt.content + warp + warp
      }
    }
  }
</script>

<style scoped lang="scss">
  .dropzone {
      border-radius: 1rem;
      height: 200px;
      background: rgb(246, 246, 246);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 120%;
      color: gray;
      margin: 100px;
  }
  .dropzone-container {
    text-align: center;
  }
  .main {
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: column;
  }
  .tool-area {
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .btn-class {
    width: 300px;
  }
  .output-area {
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
  .output-textarea {
    width: 50%;
  }
</style>
