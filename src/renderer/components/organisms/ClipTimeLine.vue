<template>
  <draggable
    class="clip-time-line"
    :value="CLIP_LIST"
    @change="swapClipOrder"
  >
    <transition-group type="transition" class="clip-list" name="clip-list">
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
    </transition-group>
  </draggable>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
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
      _selectClip: clipTypes.a.SELECT_CLIP,
      _swapClipOrder: clipTypes.a.SWAP_CLIP_ORDER
    }),
    selectClip(id) {
      this._selectClip(id)
    },
    isSelected(id) {
      if (!this.SELECTED_CLIP) return false
      return this.SELECTED_CLIP.id === id
    },
    swapClipOrder({ moved: { newIndex, oldIndex } }) {
      this._swapClipOrder({ to: newIndex, from: oldIndex })
    }
  }
}
</script>

<style lang="scss" scoped>
.clip-time-line {
  .clip-list {
    display: flex;
    height: 8rem;
    user-select: none;
  }
  .clip-list-move {
    transition: transform 0.5s;
  }
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
