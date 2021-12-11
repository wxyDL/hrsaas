// 审批的路由规则
// 引入layout的组件
import Layout from '@/layout'
export default {
  path: '/setting',
  name: 'settings',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import ('@/views/setting'),
      name: 'settings',
      meta: {
        title: '公司设置',
        icon: 'setting'
      }
    }
  ]
}
