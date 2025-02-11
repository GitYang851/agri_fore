import { createRouter, createWebHistory } from 'vue-router'

/**
 *  页面 和 组件
 */
import Login from '@/views/login/index.vue'
import Register from '@/views/register/index.vue'
import CustomLayout from '@/components/custom/Layout.vue'
import AdminLayout from '@/components/admin/Layout.vue'
/**
 *  custom
 */
import CustomHome from '@/views/custom/home/index2.vue'
import CustomCategory from '@/views/custom/category/index2.vue'
import CustomCart from '@/views/custom/cart/index2.vue'
import CustomOrder from '@/views/custom/order/index.vue'
import CustomCenter from '@/views/custom/personal center/index.vue'
/**
 *  admin
 */
import AdminOrder from '@/views/admin/order/index.vue'
import AdminProduct from '@/views/admin/product/index.vue'
import AdminUser from '@/views/admin/user/index.vue'

/**
 * 商品详情
 */
import ProductDetail from '@/views/custom/product/index.vue'
const routes = [
  {
    path: '/login',
    name: 'login page', // 自定义的组件（页面）名称
    component: Login, // 导入的组件
  },
  {
    path: '/reg',
    name: 'register page', // 自定义的组件（页面）名称
    component: Register, // 导入的组件
  },
  {
    path: '/',
    name: 'custom layout',
    component: CustomLayout,
    children: [
      {
        path: '/',
        component: CustomHome,
        meta: { title: '首页' },
      },
      {
        path: '/category',
        component: CustomCategory,
        meta: { title: '分类' },
      },
      {
        path: '/cart',
        component: CustomCart,
        meta: { title: '购物车' },
      },
      {
        path: '/order',
        component: CustomOrder,
        meta: { title: '订单' },
      },
      {
        path: '/product',
        component: ProductDetail,
        meta: { title: '商品详情' },
      },
      {
        path: '/center',
        component: CustomCenter,
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin layout',
    component: AdminLayout,
    children: [
      {
        path: '/admin/user',
        component: AdminUser,
        meta: { title: '用户管理' },
      },
      {
        path: '/admin/product',
        component: AdminProduct,
        meta: { title: '商品管理' },
      },
      {
        path: '/admin/order',
        component: AdminOrder,
        meta: { title: '订单管理' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
