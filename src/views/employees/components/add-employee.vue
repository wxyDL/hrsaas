<template>
  <!-- 新增员工对话框 -->
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 新增员工表单 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 50%" placeholder="请选择聘用形式">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width: 50%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree v-if="showTree" :data="treeData" :props="{ label: 'name' }" :default-expand-all="true" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width: 50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="btnCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="btnOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 引入公司的组织架构
import { getDepartments } from '@/api/departments'
// 引入工具里的递归方法
import { tranListToTreeData } from '@/utils'
// 引入聘用形式的数据
import EmployeeEnum from '@/api/constant/employees'
// 引入新增员工的接口
import { addEmployee } from '@/api/employees'

export default {
  name: '',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 聘用形式的数据
      EmployeeEnum,
      // 表单的数据
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 表单的校验规则
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      // 树形组织架构的数据
      treeData: [],
      // 是否显示树形结构
      showTree: false,
      // 加载动画
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 获取公司的部门
    async getDepartments() {
      // 打开树形结构
      this.showTree = true
      this.loading = true
      // 调用组织架构的接口
      const { depts } = await getDepartments()
      // 调用递归将组织架构转化成树形结构
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 点击被选中的部门事件
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 点击确定新增员工
    btnOk() {
      // 校验表单
      this.$refs.formRef.validate(async isOk => {
        if (isOk) {
          // 调用新增员工的接口
          await addEmployee(this.formData)
          this.$message.success('新增员工成功!')
          // 调用父组件的实例对象的更新员工的方法
          this.$parent.getEmployeeList()
          this.$parent.showDialog = false
        } else {
          return this.$message.error('请填写表单数据')
        }
      })
    },
    // 点击取消关闭对话框及重置数据
    btnCancel() {
      // 清空表单数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 清空表单校验
      this.$refs.formRef.resetFields()
      // 关闭对话框
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style scoped lang = "less">

</style>
