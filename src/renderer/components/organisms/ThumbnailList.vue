<template>
  <div>
    <ul class="thumbnail-list">
      <li v-for="(clip, i) in clipList" :key="clip.id">
        <div
          class="thumbnail-item"
          :class="{selected: isSelected(clip)}"
        >
          <el-button
            type="primary" size="small" round
            icon="el-icon-circle-plus-outline"
            @click="addImage({ index: i })"
          />
          <el-button
            type="danger" size="small" round
            icon="el-icon-delete"
            @click="removeImage(clip.id)"
          />
          <div>
            <p>{{i}}: {{clip.id}}</p>
            <div class="thumbnail" @click="selectImage(clip.id)">
              <img :src="clip.base64" />
            </div>
          </div>
        </div>
      </li>
    </ul>
    <el-button
      type="primary" size="small" round
      icon="el-icon-circle-plus-outline"
      @click="addImage({ index: clipList.length })"
    />
  </div>
</template>

<script>
export default {
  props: {
    clipList: {
      type: Array,
      required: true
    },
    selectedId: {
      type: Number,
      default: -1
    }
  },
  methods: {
    isSelected(clip) {
      return clip.id === this.selectedId
    },
    addImage({ index }) {
      this.$emit('addImage', { index })
    },
    removeImage(id) {
      this.$emit('removeImage', id)
    },
    selectImage(id) {
      this.$emit('selectImage', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.thumbnail-list {
  list-style: none;
  .thumbnail-item {
    border: 0.1rem solid gray;
    background-color: #fff;
    border-radius: 0.4rem;
    margin: 0.4rem;
    padding: 0.4rem;
    &.selected {
      border: 0.1rem solid orange;
      background-color: orange;
    }
    .thumbnail {
      text-align: center;
      cursor: pointer;
      img {
        border: 0.1rem solid gray;
        max-width: 100%;
        max-height: 20rem;
        width: auto;
        height: auto;
      }
    }
  }
}
</style>
