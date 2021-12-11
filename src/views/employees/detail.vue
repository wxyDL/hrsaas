<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账号设置">
            <el-form ref="formRef" :rules="rules" :model="userInfo" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input v-model="userInfo.password2" style="width: 300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 个人详情组件 -->
            <component :is="UserComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 引入获取用户信息的接口
import { getUserDateilById } from '@/api/user'
// 引入保存用户信息的接口
import { saveUserDetailById } from '@/api/employees'
// 引入个人详情的组件
import UserInfo from '@/views/employees/components/user-info.vue'
// 引入岗位信息的组件
import JobInfo from '@/views/employees/components/job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      // 定义动态的个人详情组件
      UserComponent: 'UserInfo',
      // 定义动态的岗位信息组件
      JobComponent: 'JobInfo',
      // 用户id
      userId: this.$route.params.id,
      // 用户信息
      userInfo: {
        username: '',
        password2: ''
      },
      // 用户校验
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDateilById()
  },
  methods: {
    //   获取用户基本信息
    async getUserDateilById() {
      this.userInfo = await getUserDateilById(this.userId)
    },
    // 保存用户信息
    saveUserInfo() {
      this.$refs.formRef.validate(async isOk => {
        if (isOk) {
          await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
          this.$message.success('更新用户信息成功')
        } else {
          return this.$message.error('请填写用户信息')
        }
      })
    }
  }
}
</script>

<style>

</style>
