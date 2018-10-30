<template>
  <div class="clip-canvas">
    <ImagePanel :src="gif" />
    <div class="clip-list">
      <div
        v-for="clip in clipList"
        :key="clip.id"
        :style="{width: `${clip.delay / totalDelay * 100}%`}"
        class="clip-item"
        @click="$emit('selectClip', clip.id)"
      >
        <img class="image" :src="clip.base64" />
        <div class="split" />
      </div>
    </div>
  </div>
</template>

<script>
import ImagePanel from '@/components/atoms/ImagePanel'

export default {
  components: {
    ImagePanel
  },
  props: {
    gif: {
      type: String,
      default: ''
    },
    clipList: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalDelay() {
      return this.clipList.reduce((sum, clip) => {
        return sum + clip.delay
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.clip-canvas {
  height: calc(100% - 8rem);
  .clip-list {
    display: flex;
    height: 8rem;
    user-select: none;
    .clip-item {
      display: flex;
      cursor: pointer;
      .image {
        width: calc(100% - 0.6rem);
        height: 100%;
        border: 0.1rem solid black;
      }
      .split {
        width: 0.6rem;
        height: 100%;
        background-color: gray;
        border: 0.12rem solid white;
        border-radius: 0.2rem;
        // cursor: move;
      }
    }
  }
}
</style>
