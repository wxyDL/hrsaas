<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 员工工具栏 -->
      <page-tools :show-tools="true">
        <!-- 记录总数 -->
        <span slot="before">共{{ query.total }}条</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" :disabled="!checkPermission('POINT-USER-ADD')" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 员工表格 -->
      <el-table v-loading="loading" :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img
              v-imagerror="require('@/assets/common/bigUserHeader.png')"
              :src="scope.row.staffPhoto"
              alt=""
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
              @click="showQrcode(scope.row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="scope">
            <!-- 自定义时间过滤器格式化时间 -->
            {{ scope.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState">
          <template slot-scope="scope">
            <!-- 用el-switch格式化账户状态 -->
            <el-switch :value="scope.row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${scope.row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(scope.row.id)">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="end">
        <el-pagination
          layout="prev, pager, next"
          :current-page="query.page"
          :page-size="query.size"
          :total="query.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 新增员工的对话框组件 -->
    <add-employees :show-dialog.sync="showDialog" />
    <!-- 头像二维码的对话框 -->
    <el-dialog :visible.sync="showQrcodedialog" title="头像二维码">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配角色的对话框组件 -->
    <assign-role ref="roleRef" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
// 引入员工综合数据的接口
import { getEmployeeList, delEmployee } from '@/api/employees'
// 引入员工的枚举对象
import EmployeeEnum from '@/api/constant/employees.js'
// 引入新增员工对话框
import AddEmployees from './components/add-employee.vue'
import { formatDate } from '@/filters'
// 引入生成二维码的方法
import Qrcode from 'qrcode'
// 引入分配角色的对话框组件
import assignRole from './components/assing-role.vue'
export default {
  components: {
    AddEmployees,
    assignRole
  },
  data() {
    return {
      // 用户综合列表的数据
      list: [],
      // 分页的参数
      query: {
        page: 1,
        size: 10,
        total: 0
      },
      // 请求数据的加载动画
      loading: false,
      // 新增员工对话框的显示与隐藏
      showDialog: false,
      // 头像二维码对话框的显示与隐藏
      showQrcodedialog: false,
      // 分配角色对话框的显示与隐藏
      showRoleDialog: false,
      // 分配角色的用户id
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取用户综合数据
    async getEmployeeList() {
      // 打开加载动画
      this.loading = true
      // 调用用户综合数据的接口获取数据
      const { total, rows } = await getEmployeeList(this.query)
      this.query.total = total
      this.list = rows
      // 关闭加载动画
      this.loading = false
    },
    // 分页的功能事件
    changePage(newPage) {
      this.query.page = newPage
      this.getEmployeeList()
    },
    // 格式化员工的聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 查找员工枚举对象中聘用形式
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    delEmployee(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 调用删除员工的接口
        try {
          await delEmployee(id)
          this.$message.success('删除员工成功!')
          this.getEmployeeList()
        } catch (error) {
          this.$message.error(error)
        }
      }).catch(() => {
        this.$message.info('您已取消删除')
      })
    },
    // 导出员工excel
    async exportData() {
      // 表头的格式
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载excel的方法
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有的员工数据
        const { rows } = await getEmployeeList({ page: 1, size: this.query.total })
        // 调用获取所有的员工数据的转换方法转换成data所要的格式
        const data = this.formatJson(headers, rows)
        // 定义复杂表头
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        // 合并选项
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        // json格式导出方法
        excel.export_json_to_excel({
          // 表头
          header: Object.keys(headers),
          // 数据
          data,
          // 文件名
          filename: '员工信息表',
          multiHeader,
          merges
        })
      })
    },
    // 将获取所有的员工数据格式[{}]转换成[[]]的格式
    formatJson(headers, rows) {
      // 遍历获取到的员工数据
      return rows.map(item => {
        // 遍历表头的数据
        return Object.keys(headers).map(key => {
          // 判断表头的日期格式
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 调用员工的枚举对象中的方法转换聘用形式的格式
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          // 根据表头的数据和数据进行对应
          return item[headers[key]]
        })
      })
    },
    // 头像二维码
    showQrcode(url) {
      // 判断该用户是否有头像
      if (url) {
        this.showQrcodedialog = true
        this.$nextTick(() => {
          // 调用toCanvas生成二维码
          Qrcode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还没有头像!')
      }
    },
    // 分配角色
    async editRole(id) {
      this.userId = id
      // 调用子组件的方法获取当前用户的角色
      await this.$refs.roleRef.getUserDateilById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>
