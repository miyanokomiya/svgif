<template>
  <div v-if="clip" class="clip-canvas">
    <div
      class="image-wrapper"
    >
      <img :src="clip.base64" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clip: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.clip-canvas {
  height: 100%;
}
.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #eee;
  overflow: hidden;
  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    border: 0.1rem solid #000;
  }
}
</style>
