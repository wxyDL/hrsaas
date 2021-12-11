<template>
  <!-- 分配角色的对话框 -->
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="success" @click="btnOk">确定</el-button>
        <el-button size="small" type="primary" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 引入获取角色的接口
import { getRoleList } from '@/api/setting'
// 引入当前用户的角色接口
import { getUserDateilById } from '@/api/user'
// 引入分配角色的接口
import { assignRoles } from '@/api/employees'
export default {
  name: '',
  components: {},
  props: {
    //   分配角色对话框的显示与隐藏
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 处理当前角色的用户id
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 所有角色列表
      roleList: [],
      //   当前角色的列表
      roleIds: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRoleList()
  },
  mounted() {},
  methods: {
    //   获取角色
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 100 })
      this.roleList = rows
    },
    // 获取当前用户的角色
    async getUserDateilById(id) {
      const { roleIds } = await getUserDateilById(id)
      this.roleIds = roleIds
    },
    // 给用户分配角色
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('分配角色成功!')
      this.$emit('update:showRoleDialog', false)
    },
    // 取消分配角色的对话框
    btnCancel() {
      // 重置当前选中角色的id
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style scoped lang = "less">

</style>
