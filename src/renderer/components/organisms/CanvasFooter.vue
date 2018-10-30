<template>
  <div class="canvas-footer">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-picture-outline"
      class="create-gif-button"
      @click="createGif"
    >
      Create Gif
    </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    createGif() {
      this.$emit('createGif')
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
