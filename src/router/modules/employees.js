// 审批的路由规则
// 引入layout的组件
import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import ('@/views/employees'),
      name: 'employees',
      meta: {
        title: '员工',
        icon: 'people'
      }
    },
    {
      // 动态传参
      path: '/employees/detail/:id',
      component: () => import ('@/views/employees/detail'),
      hidden: true,
      meta: {
        title: '用户详情'
      }
    },
    {
      // 打印路由
      path: 'print/:id',
      component: () => import ('@/views/employees/print'),
      hidden: true,
      meta: {
        title: '打印员工信息'
      }
    }
  ]
}
