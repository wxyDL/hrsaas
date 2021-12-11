<template>
  <!-- 卡片视图区域 -->
  <el-card class="page-tools">
    <!-- 工具栏 -->
    <el-row type="flex" justify="space-between">
      <!-- 左边的工具栏 -->
      <el-col v-if="showTools">
        <div class="before">
          <i class="el-icon-info" />
          <slot name="before" />
        </div>
      </el-col>
      <!-- 右边的工具栏 -->
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    //   控制左边工具栏的显示与隐藏
    showTools: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
