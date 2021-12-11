<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的布局容器 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-node :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 树形结构 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <tree-node slot-scope="{ data }" :tree-node="data" @editDepts="editDepts" @addDepts="addDepts" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
    <add-dept ref="addDeptRef" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
// 引入树形结构的封装组件
import treeNode from './compontens/tree-tools.vue'
// 引入添加部门的对话框组件
import AddDept from './compontens/add-dept.vue'
// 引入组织结构的数据接口
import { getDepartments } from '@/api/departments'
// 引入将列表数据转换成树形数据的方法
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    treeNode,
    AddDept
  },
  data() {
    return {
      company: {
        name: '合肥梦工厂股份有限公司',
        manager: '负责人',
        id: ''
      },
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 添加部门对话框的显示与隐藏
      showDialog: false,
      // 当前点击节点的信息
      node: null,
      // 控制进度弹层的显示与隐藏
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取组织架构数据
    async getDepartments() {
      // 显示loading弹层
      this.loading = true
      const result = await getDepartments()
      this.departs = tranListToTreeData(result.depts, '')
      // 隐藏loading弹层
      this.loading = false
    },
    // 点击添加子部门显示添加部门的对话框
    addDepts(node) {
      // 显示对话框
      this.showDialog = true
      this.node = node
    },
    // 编辑部门信息
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 调用子组件获取部门信息的方法
      this.$refs.addDeptRef.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card{
  padding: 30px  140px;
  font-size:14px;
}
</style>
