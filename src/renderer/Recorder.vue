<template>
  <div id="recorder">
    <RecorderPage />
  </div>
</template>

<script>
import RecorderPage from '@/components/RecorderPage'
export default {
  name: 'Recorder',
  components: {
    RecorderPage
  }
}
</script>

<style lang="scss">
@import 'ress';
html {
  font-family: 'Hiragino Kaku Gothic ProN', 'メイリオ', sans-serif;
  font-size: 62.5%; /* 10px */
}
p,
span,
pre {
  font-size: 1.6rem;
}
</style>
