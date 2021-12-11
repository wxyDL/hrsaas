<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 添加权限 -->
      <page-tools>
        <el-button slot="after" type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
      </page-tools>
      <!-- 权限列表 -->
      <el-table border :data="permissionList" row-key="id">
        <el-table-column label="权限名称" prop="name" />
        <el-table-column label="标识" align="center" prop="code" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.type === 1" type="text" @click="addPermission(2, scope.row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 权限业务对话框 -->
    <el-dialog :title="showText" :visible="showDialog" @close="btnCancel">
      <el-form ref="permissionRef" :rules="rules" :model="formData" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开关" prop="enVisible">
          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" style="width: 90%" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入权限的接口
import { getPermissionList, addPermission, updatePermission, delPermission, getPermissionDetail } from '@/api/permisson'
// 引入树形结构的接口
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      // 所有的权限列表
      permissionList: [],
      // 对话框的显示与隐藏
      showDialog: false,
      // 权限的数据
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      // 权限的表单校验
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取所以有权限
    async getPermissionList() {
      this.permissionList = tranListToTreeData(await getPermissionList(), '0')
    },
    // 删除权限
    delPermission(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delPermission(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 新增权限的对话框
    addPermission(type, pid) {
      // 如果点击的type是1则是新增操作权限反之添加访问权限
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 新增权限及编辑权限
    btnOk() {
      this.$refs.permissionRef.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            await updatePermission(this.formData)
          } else {
            await addPermission(this.formData)
          }
          this.$message.success('操作成功')
          this.getPermissionList()
          this.showDialog = false
        } else {
          this.$message.error('请先填写权限信息')
        }
      })
    },
    // 关闭权限对话框
    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
      this.$refs.permissionRef.resetFields()
      this.showDialog = false
    },
    // 编辑权限的对话框渲染
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
