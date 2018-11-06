<template>
  <RectangleElement
    v-if="svgElement.name === 'rectangle'"
    :svgElement="svgElement"
    :moveVec="moveVec"
    :selected="selected"
    :scale="scale"
    :plain="plain"
    @startMove="startMove"
    @deleteElement="deleteElement"
    @startResize="startResize"
    @startResizeWidth="startResizeWidth"
    @startRotate="startRotate"
  />
  <CircleElement
    v-else-if="svgElement.name === 'circle'"
    :svgElement="svgElement"
    :moveVec="moveVec"
    :selected="selected"
    :scale="scale"
    :plain="plain"
    @startMove="startMove"
    @deleteElement="deleteElement"
    @startResize="startResize"
    @startResizeWidth="startResizeWidth"
    @startRotate="startRotate"
  />
</template>

<script>
import RectangleElement from './svgElements/RectangleElement'
import CircleElement from './svgElements/CircleElement'

export default {
  components: {
    RectangleElement,
    CircleElement
  },
  props: {
    svgElement: {
      type: Object,
      required: true
    },
    moveVec: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    },
    selected: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    startMove(id) {
      this.$emit('startMove', id)
    },
    deleteElement(id) {
      this.$emit('deleteElement', id)
    },
    startResize(id) {
      this.$emit('startResize', id)
    },
    startResizeWidth(id) {
      this.$emit('startResizeWidth', id)
    },
    startRotate(id) {
      this.$emit('startRotate', id)
    }
  }
}
</script>
