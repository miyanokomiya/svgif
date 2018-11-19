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
        :style="{width: `${clip.delay / WHOLE_DELAY * 100}%`}"
        class="clip-item"
        :class="{ selected: isSelected(clip.id) }"
        @click="selectClip(clip.id)"
      >
        <div class="image">
          <img
            :src="clip.base64"
            :style="{ width: `${clip.width / WHOLE_SIZE.width * 100}%`, height: `${clip.height / WHOLE_SIZE.height * 100}%` }"
          />
          <SvgRender
            class="svg"
            :svgElementList="clip.svgElementList"
            :size="WHOLE_SIZE"
          />
        </div>
        <div class="split" />
      </div>
    </transition-group>
  </draggable>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@/store/modules/clips/types'
import draggable from 'vuedraggable'
import SvgRender from '@/components/organisms/SvgRender'
import ImagePanel from '@/components/atoms/ImagePanel'

export default {
  components: {
    draggable,
    SvgRender,
    ImagePanel
  },
  computed: {
    ...mapGetters({
      CLIP_LIST: clipTypes.g.CLIP_LIST,
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE,
      WHOLE_DELAY: clipTypes.g.WHOLE_DELAY
    })
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
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: calc(100% - 0.6rem);
      height: 100%;
      border: 0.1rem solid black;
      img {
        width: 100%;
        height: 100%;
      }
      .svg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
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
