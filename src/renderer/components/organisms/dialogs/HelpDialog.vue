<template>
  <el-dialog title="Help" :visible.sync="_value">
    <el-card class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span></span>
      </div> -->
      <ul class="help-list">
        <li>
          <code>Ctrl(⌘) + A</code><span>Select All</span>
        </li>
      </ul>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Select and..</span>
      </div>
      <ul class="help-list">
        <li>
          <code>Ctrl(⌘) + C</code><span>Copy</span>
        </li>
        <li>
          <code>Ctrl(⌘) + X</code><span>Cut</span>
        </li>
        <li>
          <code>Ctrl(⌘) + V</code><span>Paste</span>
        </li>
      </ul>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="_value = false">CLOSE</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  text-align: left;
  margin: 1rem 0;
}
.help-list {
  list-style: none;
  padding: 0 1rem;
  li {
    display: flex;
    margin: 0.4rem 0;
    border-bottom: 0.1rem solid rgba(gray, 0.2);
    code,
    span {
      line-height: 2.4rem;
    }
    code {
      width: 12rem;
      margin-right: 1rem;
    }
  }
}
</style>
