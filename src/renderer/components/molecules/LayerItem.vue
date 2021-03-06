<template>
  <div class="layer-item">
    <div class="layer-order-handle"><div/><div/></div>
    <div class="right" :class="{ current, editing }">
      <div class="box" :style="{left: `${localFrom / wholeDelay * 100}%`, right: `${(wholeDelay - localTo) / wholeDelay * 100}%`}" >
        <DragHandler class="from" @drag="changeFrom" @dragEnd="changeRange" />
        <DragHandler
          class="range"
          @click.native="$emit('selectLayer', layer.id)"
          @drag="changeFromTo"
          @dragEnd="changeRange"
        >
          <SvgRender
            class="svg"
            :svgElementList="layer.svgElementList"
            :size="wholeSize"
          />
        </DragHandler>
        <DragHandler class="to" @drag="changeTo" @dragEnd="changeRange" />
      </div>
    </div>
    <el-button
      type="danger"
      size="mini"
      icon="el-icon-delete"
      class="delete-layer-button"
      @click="$emit('deleteLayer', layer.id)"
    />
  </div>
</template>

<script>
import SvgRender from '@/components/organisms/SvgRender'
import DragHandler from '@/components/atoms/DragHandler'
import { fitNearValue } from '@/commons/utils/geo'

export default {
  components: {
    SvgRender,
    DragHandler
  },
  data: () => ({
    moveDelayFrom: 0,
    moveDelayTo: 0
  }),
  props: {
    layer: {
      type: Object,
      required: true
    },
    wholeDelay: {
      type: Number,
      required: true
    },
    wholeSize: {
      type: Object,
      required: true
    },
    current: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    },
    splitFrameList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    localFrom() {
      return this.layer.from + this.moveDelayFrom
    },
    localTo() {
      return this.layer.to + this.moveDelayTo
    },
    fitTargetList() {
      return this.splitFrameList.filter(
        a => a !== this.layer.from && a !== this.layer.to
      )
    },
    fitThreshold() {
      return Math.min(Math.max(this.wholeDelay / 1000, 10), 100)
    }
  },
  methods: {
    fitNearFrame(val) {
      return fitNearValue(val, this.fitTargetList, this.fitThreshold)
    },
    changeFrom({ x }) {
      if (!this.$el) return
      const width = this.$el.getBoundingClientRect().width
      const rate = x / width
      this.moveDelayFrom = rate * this.wholeDelay
      if (this.localFrom < 0) this.moveDelayFrom = -this.layer.from
      else if (this.localTo < this.localFrom)
        this.moveDelayFrom = this.localTo - this.layer.from
      // フィット
      this.moveDelayFrom = this.fitNearFrame(this.localFrom) - this.layer.from
    },
    changeTo({ x }) {
      if (!this.$el) return
      const width = this.$el.getBoundingClientRect().width
      const rate = x / width
      this.moveDelayTo = rate * this.wholeDelay
      if (this.localTo < this.localFrom)
        this.moveDelayTo = this.layer.from - this.layer.to
      else if (this.wholeDelay < this.localTo)
        this.moveDelayTo = this.wholeDelay - this.layer.to
      // フィット
      this.moveDelayTo = this.fitNearFrame(this.localTo) - this.layer.to
    },
    changeFromTo({ x }) {
      this.changeFrom({ x })
      this.changeTo({ x })
    },
    changeRange() {
      this.$emit('changeRange', {
        id: this.layer.id,
        from: this.localFrom,
        to: this.localTo
      })
      this.moveDelayFrom = 0
      this.moveDelayTo = 0
    }
  }
}
</script>

<style lang="scss" scoped>
$handle-width: 1rem;
$button-width: 2rem;
$edge-width: 0.8rem;

.layer-item {
  display: flex;
  height: 3rem;
  width: 100%;
  border-bottom: 0.1rem solid gray;
  .layer-order-handle {
    width: $handle-width;
    height: 100%;
    border: 0.1rem solid gray;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: move;
    div {
      height: 0.3rem;
      width: 0.3rem;
      margin: 0.2rem 0;
      background-color: gray;
      border-radius: 50%;
    }
  }
  .delete-layer-button {
    width: $button-width;
    padding-right: 0;
    padding-left: 0;
  }
  .right {
    position: relative;
    width: calc(100% - #{$button-width});
    opacity: 0.3;
    .box {
      position: absolute;
      display: flex;
      height: 100%;
      border: 0.1rem solid gray;
      border-radius: 0.2rem;
      overflow: hidden;
      .from,
      .to {
        height: 100%;
        width: $edge-width;
        background-color: #aaa;
        border: 0.1rem solid #666;
      }
      .range {
        position: relative;
        height: 100%;
        width: calc(100% - 2 * #{$edge-width});
        background-color: #eee;
        .svg {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        }
      }
    }
    &.current {
      opacity: 1;
    }
    &.editing {
      .box {
        border: 0.3rem solid lime;
      }
    }
  }
}
</style>
