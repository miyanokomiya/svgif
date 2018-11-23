<template>
  <div class="time-line-wrapper">
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

      <draggable
        class="layer-time-line"
        :value="LAYER_LIST"
        :options="{ handle: '.handle' }"
        @change="swapLayerOrder"
      >
        <transition-group type="transition" class="layer-list" name="layer-list">
          <LayerItem
            v-for="layer in LAYER_LIST"
            :key="layer.id"
            :layer="layer"
            :wholeDelay="WHOLE_DELAY"
            :current="isCurrentLayer(layer.id)"
            :selected="isSelectedLayer(layer.id)"
            @deleteLayer="deleteLayer"
            @selectLayer="selectLayer"
            @changeRange="changeRange"
          />
        </transition-group>
      </draggable>
      <div>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus"
          class="add-layer-button"
          @click="createLayer"
        />
      </div>
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
import draggable from 'vuedraggable'
import SvgRender from '@/components/organisms/SvgRender'
import ImagePanel from '@/components/atoms/ImagePanel'
import LayerItem from '@/components/molecules/LayerItem'

export default {
  components: {
    draggable,
    SvgRender,
    ImagePanel,
    LayerItem
  },
  computed: {
    ...mapGetters({
      CLIP_LIST: clipTypes.g.CLIP_LIST,
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE,
      WHOLE_DELAY: clipTypes.g.WHOLE_DELAY,
      LAYER_LIST: clipTypes.g.LAYER_LIST,
      CURRENT_LAYER_LIST: clipTypes.g.CURRENT_LAYER_LIST,
      SELECTED_LAYER: clipTypes.g.SELECTED_LAYER,
      CURRENT_TIME: clipTypes.g.CURRENT_TIME
    })
  },
  methods: {
    ...mapActions({
      _selectClip: clipTypes.a.SELECT_CLIP,
      _swapClipOrder: clipTypes.a.SWAP_CLIP_ORDER,
      _createLayer: clipTypes.a.CREATE_LAYER,
      _deleteLayer: clipTypes.a.DELETE_LAYER,
      _selectLayer: clipTypes.a.SELECT_LAYER,
      _updateLayerRange: clipTypes.a.UPDATE_LAYER_RANGE
    }),
    isCurrentLayer(id) {
      return !!this.CURRENT_LAYER_LIST.find(l => l.id === id)
    },
    isSelectedLayer(id) {
      return this.SELECTED_LAYER.id === id
    },
    selectClip(id) {
      this._selectClip(id)
    },
    isSelected(id) {
      if (!this.SELECTED_CLIP) return false
      return this.SELECTED_CLIP.id === id
    },
    swapClipOrder({ moved: { newIndex, oldIndex } }) {
      this._swapClipOrder({ to: newIndex, from: oldIndex })
    },
    swapLayerOrder({ moved: { newIndex, oldIndex } }) {
      console.log({ to: newIndex, from: oldIndex })
      // this._swapClipOrder({ to: newIndex, from: oldIndex })
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
    }
  }
}
</script>

<style lang="scss" scoped>
$button-width: 2rem;

.time-line-wrapper {
  overflow: auto;
}
.time-line-body {
  position: relative;
}
.current-time {
  position: absolute;
  height: 100%;
  top: 0;
  width: 0.3rem;
  margin-left: $button-width; // FIXME 削除ボタン部分の幅を含めた％計算になってしまっている
  background-color: lime;
  border-radius: 0.2rem;
  opacity: 0.8;
  pointer-events: none;
}
.clip-time-line {
  padding-left: $button-width;
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
.layer-time-line {
  .layer-list {
    user-select: none;
  }
  .layer-list-move {
    transition: transform 0.5s;
  }
}
.add-layer-button {
  width: $button-width;
  padding-right: 0;
  padding-left: 0;
}
</style>
