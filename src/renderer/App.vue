<template>
  <div id="app">
    <MainPage/>
  </div>
</template>

<script>
import MainPage from '@/components/MainPage'
export default {
  name: 'App',
  components: {
    MainPage
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
