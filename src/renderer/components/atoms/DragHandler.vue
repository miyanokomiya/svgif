<template>
  <div @mousedown="startDrag"><slot/></div>
</template>

<script>
export default {
  data: () => ({
    startP: null,
    moveP: null
  }),
  beforeDestroy() {
    this.clearHandler()
  },
  methods: {
    clearHandler() {
      window.removeEventListener('mousemove', this.drag, true)
      window.removeEventListener('mouseup', this.endDrag, true)
    },
    startDrag(e) {
      this.startP = { x: e.pageX, y: e.pageY }
      this.$emit('dragStart')
      window.addEventListener('mousemove', this.drag, true)
      window.addEventListener('mouseup', this.endDrag, true)
    },
    endDrag() {
      this.clearHandler()
      if (this.startP && this.moveP) {
        this.$emit('dragEnd', {
          x: this.moveP.x - this.startP.x,
          y: this.moveP.y - this.startP.y,
          from: this.startP,
          to: this.moveP
        })
      }
      this.startP = null
      this.moveP = null
    },
    drag(e) {
      this.moveP = {
        x: e.pageX,
        y: e.pageY
      }
      this.$emit('drag', {
        x: this.moveP.x - this.startP.x,
        y: this.moveP.y - this.startP.y,
        from: this.startP,
        to: this.moveP
      })
    }
  }
}
</script>
