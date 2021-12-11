<template>
  <upload-excel :on-success="success" />
</template>

<script>
// 引入excel的导入接口
import { importEmployee } from '@/api/employees'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async success({ header, results }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const newArry = []
      //   遍历excel里的数据
      results.forEach(item => {
        const userInfo = {}
        // 将中文的key转成英文的key
        Object.keys(item).forEach(key => {
          // 判断key是不是日期格式的，是则转换
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        // 将有英文的key添加到新的数组中
        newArry.push(userInfo)
      })
      //   调用导入excel的接口
      await importEmployee(newArry)
      this.$message.success('导入员工成功!')
      //   跳回刚刚的页面
      this.$router.back()
    },
    // 对excel表中的日期进行转化
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped lang = "less">

</style>
