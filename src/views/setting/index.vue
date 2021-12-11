<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片视图 -->
      <el-card>
        <!-- tabs标签页 -->
        <el-tabs>
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <!-- 添加角色 -->
            <el-row>
              <el-button icon="el-icon-plus" type="primary" size="small" @click="dialogVisible = true">添加角色</el-button>
            </el-row>
            <!-- 角色信息 -->
            <el-table border :data="list" style="margin-top: 20px">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="assignPerm(scope.row.id)">分配权限</el-button>
                  <el-button type="info" size="small" @click="editRolue(scope.row.id)">修改</el-button>
                  <el-button type="danger" size="small" @click="deleteRole(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row type="flex" justify="center">
              <el-pagination
                style="margin-top: 10px"
                layout="prev, pager, next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="pageClick"
              />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息 ">
            <!-- 提示信息 -->
            <el-alert
              show-icon
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              center
              closable
            />
            <!-- 公司信息 -->
            <el-form label-width="120px" style="margin-top: 20px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled type="textarea" :rows="3" style="400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 修改角色详情的对话框 -->
    <el-dialog
      :title="showTitle"
      :visible.sync="dialogVisible"
      @close="btnCancel"
    >
      <!-- 角色详情的表单 -->
      <el-form ref="formRef" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible="showPerDialog" @close="btnPerCancel">
      <el-tree
        ref="PermissionRef"
        :data="permData"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectId"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPerOk">确定</el-button>
          <el-button size="small" @click="btnPerCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入角色信息的接口
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRoles, assignPerm } from '@/api/setting'
// 引入store里公司的id
import { mapGetters } from 'vuex'
// 引入权限接口
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      // 角色信息列表
      list: [],
      // 分页的数据
      page: {
        // 当前页
        page: 1,
        // 每页多少条
        pagesize: 3,
        // 总共多少条数据
        total: 0
      },
      // 公司信息列表
      formData: [],
      // 对话框的显示与隐藏
      dialogVisible: false,
      // 角色的详情信息
      roleForm: {
        name: '',
        description: ''
      },
      // 角色名称的校验
      rules: {
        name: [
          { trigger: 'blur', required: 'true', message: '角色名称不能为空!' }
        ]
      },
      // 分配权限对话框的显示与隐藏
      showPerDialog: false,
      // 权限的列表
      permData: [],
      // 权限的配置项
      defaultProps: {
        label: 'name'
      },
      // 当前角色的id
      rolesId: null,
      // 当前角色所拥有的权限的id
      selectId: []
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    // 动态显示对话框的标题
    showTitle() {
      if (this.roleForm.id) {
        return '编辑角色'
      } else {
        return '新增角色'
      }
    }
  },
  created() {
    // 页面加载成功后加载数据
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色信息的方法
    async getRoleList() {
      // 调用获取角色信息的方法
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    // 点击页码显示对应的数据
    pageClick(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 获取公司信息的方法
    async getCompanyInfo() {
      // 调用获取公司信息的接口
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除角色信息
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          // 调用删除角色信息的接口
          await deleteRole(id)
          // 重新获取角色数据
          this.getRoleList()
          this.$message.success('删除角色成功！')
        } catch (error) {
          console.log(error)
        }
      })
    },
    // 点击修改获取角色详情
    async editRolue(id) {
      // 调用获取角色的接口
      this.roleForm = await getRoleDetail(id)
      // 打开对话框
      this.dialogVisible = true
    },
    // 编辑角色信息
    btnOk() {
      this.$refs.formRef.validate(async isOk => {
        if (isOk) {
          // 有id表示是编辑功能,反之则是新增
          if (this.roleForm.id) {
            // 校验通过，调用编辑角色接口
            await updateRole(this.roleForm)
            this.$message.success('编辑角色成功!')
          } else {
            // 调用新增角色的接口
            await addRoles(this.roleForm)
            this.$message.success('新增角色成功!')
          }
          // 重新获取角色列表信息
          this.getRoleList()
          // 提示编辑成功
          // 关闭对话框
          this.dialogVisible = false
        } else {
          return this.$message.error('校验不通过，请填写相关的信息')
        }
      })
    },
    // 关闭对话框的方法
    btnCancel() {
      // 清空表单的数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 清空表单的校验数据
      this.$refs.formRef.resetFields()
      this.dialogVisible = false
    },
    // 分配权限对话框
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      this.rolesId = id
      const { permIds } = await getRoleDetail(id)
      this.selectId = permIds
      this.showPerDialog = true
    },
    // 给用户分配权限
    async btnPerOk() {
      await assignPerm({ permIds: this.$refs.PermissionRef.getCheckedKeys(), id: this.rolesId })
      this.showPerDialog = false
      this.$message.success('分配权限成功')
    },
    // 关闭分配权限的对话框
    btnPerCancel() {
      this.selectId = []
      this.showPerDialog = false
    }
  }
}
</script>

<style>

</style>
