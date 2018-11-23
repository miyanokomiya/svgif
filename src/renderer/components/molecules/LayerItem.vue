<template>
  <div class="layer-item">
    <el-button
      type="danger"
      size="mini"
      icon="el-icon-delete"
      class="delete-layer-button"
      @click="$emit('deleteLayer', layer.id)"
    />
    <div class="right" :class="{ current, selected }" @click="$emit('selectLayer', layer.id)">
      <div class="box" :style="{left: `${localFrom / wholeDelay * 100}%`, right: `${localTo / wholeDelay * 100}%`}" >
        <div class="from" @mousedown="startChangeFrom" />
        <div class="range" />
        <div class="to" @mousedown="startChangeTo" />
      </div>
    </div>
    <!-- <SvgRender
      class="svg"
      :svgElementList="layer.svgElementList"
      :size="WHOLE_SIZE"
    /> -->
  </div>
</template>

<script>
export default {
  data: () => ({
    startXFrom: 0,
    moveDelayFrom: 0,
    startXTo: 0,
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
    current: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    localFrom() {
      return Math.min(this.layer.from + this.moveDelayFrom, this.layer.to)
    },
    localTo() {
      return Math.max(this.layer.to - this.moveDelayTo, this.layer.from)
    }
  },
  methods: {
    startChangeFrom(e) {
      this.startXFrom = e.pageX
      window.addEventListener('mousemove', this.changeFrom, true)
      window.addEventListener('mouseup', this.endChangeFrom, true)
    },
    endChangeFrom() {
      window.removeEventListener('mousemove', this.changeFrom, true)
      window.removeEventListener('mouseup', this.endChangeFrom, true)
      this.changeRange()
      this.startXFrom = 0
      this.moveDelayFrom = 0
    },
    changeFrom(e) {
      if (!this.$el) return
      const width = this.$el.getBoundingClientRect().width
      const rate = (e.pageX - this.startXFrom) / width
      this.moveDelayFrom = rate * this.wholeDelay
    },
    startChangeTo(e) {
      this.startXTo = e.pageX
      window.addEventListener('mousemove', this.changeTo, true)
      window.addEventListener('mouseup', this.endChangeTo, true)
    },
    endChangeTo() {
      window.removeEventListener('mousemove', this.changeTo, true)
      window.removeEventListener('mouseup', this.endChangeTo, true)
      this.changeRange()
      this.startXTo = 0
      this.moveDelayTo = 0
    },
    changeTo(e) {
      if (!this.$el) return
      const width = this.$el.getBoundingClientRect().width
      const rate = (e.pageX - this.startXTo) / width
      this.moveDelayTo = rate * this.wholeDelay
    },
    changeRange() {
      this.$emit('changeRange', {
        id: this.layer.id,
        from: this.localFrom,
        to: this.localTo
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$button-width: 2rem;
$edge-width: 0.8rem;

.layer-item {
  display: flex;
  height: 3rem;
  width: 100%;
  border-bottom: 0.1rem solid gray;
  cursor: pointer;
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
        cursor: move;
      }
      .range {
        height: 100%;
        width: calc(100% - 2 * #{$edge-width});
        background-color: #eee;
      }
    }
    &.current {
      opacity: 1;
    }
    &.selected {
      .box {
        border: 0.3rem solid tomato;
      }
    }
  }
}
</style>
