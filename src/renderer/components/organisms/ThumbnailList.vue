<template>
  <div>
    <draggable
      class="thumbnail-list"
      :value="clipList"
      @change="swapClipOrder"
    >
      <transition-group type="transition" name="flip-list">
        <div
          v-for="(clip, i) in clipList"
          :key="clip.id"
          class="thumbnail-item"
          :class="{selected: isSelected(clip)}"
          @click="selectClip(clip.id)"
        >
          <div class="header">
            <span class="index">{{i + 1}}</span>
            <el-input
              class="delay-input"
              size="mini"
              placeholder="Delay"
              type="number"
              :value="clip.delay"
              @input="val => updateDelay({ id: clip.id, delay: val })"
            >
            </el-input>
            <span class="delay-input-unit">ms</span>
            <el-button
              class="delete-button"
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
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
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
    },
    swapClipOrder({ moved: { newIndex, oldIndex } }) {
      this.$emit('swapClipOrder', { to: newIndex, from: oldIndex })
    },
    updateDelay({ id, delay }) {
      const num = parseInt(delay)
      if (isNaN(num) || num < 10 || 10000 < num) {
        this.$notify.error({
          title: 'Error',
          message: 'Delay time must be 10 to 10000.'
        })
      } else {
        this.$emit('updateDelay', { id, delay: num })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.thumbnail-list {
  .flip-list-move {
    transition: transform 0.5s;
  }
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
        text-align: center;
        background-color: #fff;
        border: 0.1rem solid #000;
        border-radius: 50%;
        padding: 0 0.7rem;
      }
      .delay-input {
        width: 7rem;
        margin: 0 0.6rem;
        text-align: right;
        /deep/ .el-input__inner {
          padding: 0 0.4rem;
          text-align: right;
        }
      }
      // .delay-input-unit {}
      .delete-button {
        margin-left: auto;
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
