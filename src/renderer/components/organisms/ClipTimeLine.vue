<template>
  <div class="time-line-wrapper">
    <div class="current-time-slider" ref="currentTimeSlider" @click.self="setCurrentTime">
      <DragHandler
        class="current-time-slider-item"
        :style="{ 'margin-left': `${CURRENT_TIME / WHOLE_DELAY * 100}%` }"
        @dragStart="startChangeCurrentTime"
        @drag="moveCurrentTime"
      />
    </div>
    <div class="time-line-body">
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
            :class="{ current: isSelectedClip(clip.id), editing: isEditTargetClip(clip.id) }"
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

      <draggable
        class="layer-time-line"
        :value="LAYER_LIST"
        :options="{ handle: '.layer-order-handle' }"
        @change="swapLayerOrder"
      >
        <transition-group type="transition" class="layer-list" name="layer-list">
          <LayerItem
            v-for="layer in LAYER_LIST"
            :key="layer.id"
            :layer="layer"
            :wholeDelay="WHOLE_DELAY"
            :wholeSize="WHOLE_SIZE"
            :current="isCurrentLayer(layer.id)"
            :editing="isEditTargetLayer(layer.id)"
            @deleteLayer="deleteLayer"
            @selectLayer="selectLayer"
            @changeRange="changeRange"
          />
        </transition-group>
      </draggable>
      <div class="layer-button-box">
        <el-button
          :type="playGifTimer ? 'warning' : 'success'"
          size="mini"
          class="play-gif"
          @click="playGif"
        >
          {{playGifTimer ? 'Stop' : 'Play'}}
        </el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus"
          @click="createLayer"
        />
      </div>
    </div>
    <div class="current-time-wrapper">
      <div
        class="current-time"
        :style="{ left: `${CURRENT_TIME / WHOLE_DELAY * 100}%` }"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@/store/modules/clips/types'
import { getPoint } from '@/commons/utils/canvas'
import draggable from 'vuedraggable'
import SvgRender from '@/components/organisms/SvgRender'
import ImagePanel from '@/components/atoms/ImagePanel'
import LayerItem from '@/components/molecules/LayerItem'
import DragHandler from '@/components/atoms/DragHandler'

export default {
  components: {
    draggable,
    SvgRender,
    ImagePanel,
    LayerItem,
    DragHandler
  },
  data: () => ({
    currentTimeAtStart: 0,
    playGifTimer: null
  }),
  computed: {
    ...mapGetters({
      CLIP_LIST: clipTypes.g.CLIP_LIST,
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE,
      WHOLE_DELAY: clipTypes.g.WHOLE_DELAY,
      LAYER_LIST: clipTypes.g.LAYER_LIST,
      CURRENT_LAYER_LIST: clipTypes.g.CURRENT_LAYER_LIST,
      SELECTED_LAYER: clipTypes.g.SELECTED_LAYER,
      CURRENT_TIME: clipTypes.g.CURRENT_TIME,
      EDIT_TARGET_TYPE: clipTypes.g.EDIT_TARGET_TYPE
    })
  },
  methods: {
    ...mapActions({
      _selectClip: clipTypes.a.SELECT_CLIP,
      _swapClipOrder: clipTypes.a.SWAP_CLIP_ORDER,
      _createLayer: clipTypes.a.CREATE_LAYER,
      _deleteLayer: clipTypes.a.DELETE_LAYER,
      _swapLayerOrder: clipTypes.a.SWAP_LAYER_ORDER,
      _selectLayer: clipTypes.a.SELECT_LAYER,
      _updateLayerRange: clipTypes.a.UPDATE_LAYER_RANGE,
      _setCurrentTime: clipTypes.a.SET_CURRENT_TIME
    }),
    isEditTargetLayer(id) {
      if (this.EDIT_TARGET_TYPE !== 'layer') return false
      return this.isSelectedLayer(id)
    },
    isCurrentLayer(id) {
      return !!this.CURRENT_LAYER_LIST.find(l => l.id === id)
    },
    isSelectedLayer(id) {
      if (!this.SELECTED_LAYER) return false
      return this.SELECTED_LAYER.id === id
    },
    selectClip(id) {
      this._selectClip(id)
    },
    isEditTargetClip(id) {
      if (this.EDIT_TARGET_TYPE !== 'clip') return false
      return this.isSelectedClip(id)
    },
    isSelectedClip(id) {
      if (!this.SELECTED_CLIP) return false
      return this.SELECTED_CLIP.id === id
    },
    swapClipOrder({ moved: { newIndex, oldIndex } }) {
      this._swapClipOrder({ to: newIndex, from: oldIndex })
    },
    swapLayerOrder({ moved: { newIndex, oldIndex } }) {
      this._swapLayerOrder({ to: newIndex, from: oldIndex })
    },
    createLayer() {
      this._createLayer()
    },
    deleteLayer(id) {
      this._deleteLayer(id)
    },
    selectLayer(id) {
      this._selectLayer(id)
    },
    changeRange({ id, from, to }) {
      this._updateLayerRange({ id, from, to })
    },
    startChangeCurrentTime() {
      this.currentTimeAtStart = this.CURRENT_TIME
    },
    moveCurrentTime({ x }) {
      if (!this.$refs.currentTimeSlider) return
      const width = this.$refs.currentTimeSlider.getBoundingClientRect().width
      const rate = x / width
      const currentTime = this.currentTimeAtStart + rate * this.WHOLE_DELAY
      this._setCurrentTime(Math.max(Math.min(currentTime, this.WHOLE_DELAY), 0))
    },
    setCurrentTime(e) {
      if (!this.$refs.currentTimeSlider) return
      const p = getPoint(e)
      const width = this.$refs.currentTimeSlider.getBoundingClientRect().width
      const rate = p.x / width
      this._setCurrentTime(rate * this.WHOLE_DELAY)
    },
    playGif() {
      if (this.playGifTimer) {
        clearTimeout(this.playGifTimer)
        this.playGifTimer = null
        return
      }
      // 30フレームで再生
      const unitFrame = 1000 / 30
      const frameLoop = () => {
        if (!this.playGifTimer) return
        let nextFrame = this.CURRENT_TIME + unitFrame
        // 最後まで来たら最初に戻る
        if (this.WHOLE_DELAY < nextFrame) nextFrame = 0
        this._setCurrentTime(nextFrame)
        this.playGifTimer = setTimeout(frameLoop, unitFrame)
      }
      this.playGifTimer = setTimeout(frameLoop, unitFrame)
    }
  }
}
</script>

<style lang="scss" scoped>
$handle-width: 1rem;
$button-width: 2rem;
$time-line-slider-height: 1.4rem;
$time-line-slider-item-width: 3rem;

.time-line-wrapper {
  position: relative;
  height: 100%;
}
.current-time-slider {
  position: relative;
  height: $time-line-slider-height;
  margin-left: $handle-width;
  margin-right: $button-width;
  background-color: gray;
  border: 0.1rem solid #aaa;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  .current-time-slider-item {
    position: absolute;
    left: -$time-line-slider-item-width / 2;
    height: 100%;
    width: $time-line-slider-item-width;
    background-color: #eee;
    border: 0.1rem solid #ccc;
    cursor: move;
  }
}
.time-line-body {
  height: calc(100% - #{$time-line-slider-height});
  overflow: auto;
}
.current-time-wrapper {
  position: absolute;
  top: 0;
  margin-left: $handle-width;
  margin-right: $button-width;
  width: calc(100% - #{$handle-width} - #{$button-width});
  height: calc(100% - #{$time-line-slider-height});
  pointer-events: none;
}
.current-time {
  position: absolute;
  top: $time-line-slider-height;
  width: 0.2rem;
  height: 100%;
  margin-left: -0.1rem;
  background-color: lime;
  border-radius: 0.2rem;
  opacity: 0.8;
}
.clip-time-line {
  padding-left: $handle-width;
  padding-right: $button-width;
  border-bottom: 0.1rem solid gray;
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
    opacity: 0.3;
    &.current {
      opacity: 1;
    }
    &.editing {
      border: 0.4rem solid lime;
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
.layer-time-line {
  .layer-list {
    user-select: none;
  }
  .layer-list-move {
    transition: transform 0.5s;
  }
}
.layer-button-box {
  display: flex;
  justify-content: center;
  padding: 0.2rem 0;
  .play-gif {
    width: 7rem;
  }
}
</style>
