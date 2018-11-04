<script>
export default {
  methods: {
    htmlToSvg(val) {
      return val / this.scale
    },
    svgToHtml(val) {
      return val * this.scale
    }
  }
}
</script>
