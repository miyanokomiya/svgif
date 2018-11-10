<template>
  <div class="canvas-footer">
    <el-button
      v-if="!$svgif.isWeb"
      type="primary"
      size="mini"
      icon="el-icon-download"
      class="create-gif-button"
      :disabled="!gif"
      @click="createGif"
    >
      Export Gif
    </el-button>
  </div>
</template>

<script>
import { saveGifFile } from '@/commons/utils/file'
export default {
  props: {
    gif: {
      type: String,
      default: ''
    }
  },
  methods: {
    createGif() {
      // this.$emit('createGif')
      saveGifFile(this.gif)
    }
  }
}
</script>

<style lang="scss" scoped>
.canvas-footer {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 100%;
  background-color: #b3c0d1;
  color: #333;
  .create-gif-button {
    margin-left: auto;
  }
}
</style>
