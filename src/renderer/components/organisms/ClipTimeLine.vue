<template>
  <div class="clip-time-line">
    <div
      v-for="clip in CLIP_LIST"
      :key="clip.id"
      :style="{width: `${clip.delay / totalDelay * 100}%`}"
      class="clip-item"
      :class="{ selected: isSelected(clip.id) }"
      @click="selectClip(clip.id)"
    >
      <img class="image" :src="clip.base64" />
      <div class="split" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'

export default {
  computed: {
    ...mapGetters({
      CLIP_LIST: clipTypes.g.CLIP_LIST,
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE
    }),
    totalDelay() {
      return this.CLIP_LIST.reduce((sum, clip) => {
        return sum + clip.delay
      }, 0)
    }
  },
  methods: {
    ...mapActions({
      _selectClip: clipTypes.a.SELECT_CLIP
    }),
    selectClip(id) {
      this._selectClip(id)
    },
    isSelected(id) {
      if (!this.SELECTED_CLIP) return false
      return this.SELECTED_CLIP.id === id
    }
  }
}
</script>

<style lang="scss" scoped>
.clip-time-line {
  display: flex;
  height: 8rem;
  user-select: none;
  .clip-item {
    display: flex;
    cursor: pointer;
    &.selected {
      border: 0.4rem solid tomato;
    }
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
    }
  }
}
</style>
