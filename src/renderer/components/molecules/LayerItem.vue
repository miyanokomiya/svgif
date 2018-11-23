<template>
  <div class="layer-item">
    <el-button
      type="danger"
      size="mini"
      icon="el-icon-delete"
      class="delete-layer-button"
      @click="$emit('deleteLayer', layer.id)"
    />
    <div class="right">
      <div class="box" :style="{width: `${(layer.to - layer.from) / wholeDelay * 100}%`}" >
        <div class="from" />
        <div class="range" />
        <div class="to" />
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
  props: {
    layer: {
      type: Object,
      required: true
    },
    wholeDelay: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
$button-width: 2rem;
$edge-width: 0.6rem;

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
    width: calc(100% - #{$button-width});
    .box {
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
  }
}
</style>
