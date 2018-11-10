<template>
  <div class="image-wrapper">
    <img :src="src" :style="style" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    scale: {
      type: Number,
      default: 1
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  computed: {
    style() {
      return {
        width: this.width ? `${this.width}px` : undefined,
        height: this.height ? `${this.height}px` : undefined
      }
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
