<template>
  <RectangleElement
    v-if="svgElement.name === 'rect'"
    :svgElement="svgElement"
    :moveVec="moveVec"
    :selected="selected"
    :scale="scale"
    @startMove="startMove"
    @delete="deleteElement"
    @startResize="startResize"
  />
</template>

<script>
import RectangleElement from './svgElements/RectangleElement'

export default {
  components: {
    RectangleElement
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
    }
  },
  methods: {
    startMove(id) {
      this.$emit('startMove', id)
    },
    deleteElement(id) {
      this.$emit('delete', id)
    },
    startResize(id) {
      this.$emit('startResize', id)
    }
  }
}
</script>
