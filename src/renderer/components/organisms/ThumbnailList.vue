<template>
  <div>
    <ul class="thumbnail-list">
      <li v-for="(data, i) in dataList" :key="data.id">
        <el-button
          type="primary" size="small" round
          icon="el-icon-circle-plus-outline"
          @click="addImage({ index: i })"
        />
        <div>
          <p>{{i}}: {{data.id}}</p>
          <img :src="data.base64" />
        </div>
      </li>
    </ul>
    <el-button
      type="primary" size="small" round
      icon="el-icon-circle-plus-outline"
      @click="addImage({ index: dataList.length })"
    />
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      required: true
    }
  },
  methods: {
    addImage ({ index }) {
      this.$emit('addImage', { index })
    }
  }
}
</script>

<style lang="scss" scoped>
.thumbnail-list {
  list-style: none;
  img {
    max-width: 100%;
    max-width: 200px;
    height: auto;
  }
}
</style>

