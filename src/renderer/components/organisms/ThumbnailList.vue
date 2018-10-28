<template>
  <div>
    <ul class="thumbnail-list">
      <li v-for="(clip, i) in clipList" :key="clip.id" @click="selectClip(clip.id)">
        <div
          class="thumbnail-item"
          :class="{selected: isSelected(clip)}"
        >
          <div class="header">
            <span class="index">{{i + 1}}</span>
            <el-button
              type="danger" size="mini" round
              icon="el-icon-delete"
              @click="removeClip(clip.id)"
            />
          </div>
          <div>
            <div class="thumbnail">
              <img :src="clip.base64" />
            </div>
          </div>
          <div class="footer">
            <span class="date">{{clip.createdAt}}</span>
          </div>
        </div>
      </li>
    </ul>
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
    removeClip(id) {
      this.$emit('removeClip', id)
    },
    selectClip(id) {
      this.$emit('selectClip', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.thumbnail-list {
  list-style: none;
  .thumbnail-item {
    text-align: left;
    border: 0.1rem solid gray;
    background-color: #fff;
    border-radius: 0.4rem;
    margin: 0.4rem;
    padding: 0.4rem;
    &.selected {
      border: 0.1rem solid orange;
      background-color: orange;
    }
    .header {
      display: flex;
      align-items: center;
      .index {
        margin-right: auto;
        text-align: center;
        background-color: #fff;
        border: 0.1rem solid #000;
        border-radius: 50%;
        padding: 0 0.7rem;
      }
    }
    .thumbnail {
      display: flex;
      vertical-align: center;
      justify-content: center;
      height: 12rem;
      margin-top: 0.4rem;
      cursor: pointer;
      img {
        border: 0.1rem solid gray;
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
    }
    .footer {
      display: flex;
      align-items: center;
      .date {
        margin-left: auto;
        font-size: 1.2rem;
      }
    }
  }
}
</style>
