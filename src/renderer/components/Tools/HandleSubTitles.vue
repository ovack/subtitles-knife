<template>
  <div>
    <div class="dropzone">
      <i class="ph-file-arrow-up"></i>
      将JSON文件拖入此处
    </div></div>
</template>

<script>
  export default {
    data () {
      return {
        electron: process.versions.electron,
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version
      }
    }
  }
</script>

<style scoped>
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
  .cutzone i {
    opacity: .4;
    pointer-events: none;
    display: block;
    font-size: 7rem;
  }

  .cutzone.active {
    background: rgb(255, 204, 204);
  }

  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>
