<template>
  <!-- 添加部门对话框 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 添加部门表单 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" placeholder="1-300个字符" type="textarea" rows="3" />
      </el-form-item>
    </el-form>
    <!-- 对话框尾部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="btnCancel">取 消</el-button>
      <el-button type="primary" @click="btnOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 引入组织架构的数据
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
// 引入用户的简单信息
import { getEmployeeSimple } from '@/api/employees'

export default {
  name: '',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 定义一个函数，判断是不是存在重复的部门
    const checkNameRepeat = async(rule, value, callback) => {
      // 获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑部门的校验规则
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.formData.id).some(item => item.name === value)
      } else {
        // 新增部门的校验规则
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 去所有部门数据里去找是否有相同的部门
      isRepeat ? callback(new Error(`同级部门下已经有${value}部门了`)) : callback()
    }

    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑部门信息的校验规则
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        // 新增部门的校验规则
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 添加部门的表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      //   添加部门的表单校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍长度为1-50个字符', trigger: 'blur' }
        ]
      },
      // 用户的简单信息
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 获取用户的简单信息
    async getEmployeeSimple() {
      // 调用获取用户简单信息的接口
      this.peoples = await getEmployeeSimple()
    },
    // 点击确定新增部门
    btnOk() {
      // 校验表单
      this.$refs.formRef.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            // 编辑部门信息的方法
            await updateDepartments(this.formData)
            this.$message.success('编辑部门成功!')
          } else {
            // 新增部门的方法
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
            this.$message.success('新增部门成功!')
          }
          // 告诉父组件刷新页面
          this.$emit('addDepts')
          // 关闭对话框
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 取消关闭对话框及清空表单数据
    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.formRef.resetFields()
      this.$emit('update:showDialog', false)
    },
    // 获取部门信息的方法
    async getDepartDetail(id) {
      // 调用部门信息的接口
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style scoped lang = "less">

</style>
