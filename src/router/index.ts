import { createRouter, createWebHashHistory } from 'vue-router';
import BlankPage from '@/views/BlankPage.vue';
import { Layout } from '@/types/theme.d';
import { authCheck } from '@/utils/auth';
import type { FormType } from '@/components/AuthForm/index.vue';

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'BlankPage',
      component: BlankPage,
      meta: { title: 'Blank page', auth: true, roles: 'all' },
    },
    {
      path: '/solar-panels',
      name: 'SolarPanels',
      component: () => import('@/views/SolarPanels.vue'),
      meta: { title: 'Buy Solar Panel', auth: true, roles: 'all' },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: { title: 'Settings', auth: true, roles: 'all' },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: { title: 'Profile', auth: true, roles: 'all' },
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Auth/Login.vue'),
      meta: { title: 'Login', forceLayout: Layout.Blank, checkAuth: true },
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: () => import('@/views/Transactions.vue'),
      meta: { title: 'Transactions', auth: true, roles: 'all' },
    },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: () => import('@/views/Auth/Login.vue'),
    //   props: { formType: 'signup' as FormType },
    //   meta: { title: 'Register', forceLayout: Layout.Blank, checkAuth: true },
    // }, 
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/Auth/Login.vue'),
      props: { formType: 'forgotpassword' as FormType },
      meta: { title: 'Forgot Password', forceLayout: Layout.Blank, checkAuth: true },
    },
    {
      path: '/spp-details/:id',
      name: 'SppDetails',
      component: () => import('@/views/SppDetails.vue'),
      meta: { title: 'SPP Details', auth: true, roles: 'all' },
    },
    {
      path: '/logout',
      name: 'Logout',
      redirect: '/login',
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: { forceLayout: Layout.Blank },
    },
  ],
});

router.beforeEach((route) => {
  return authCheck(route);
});

export default router;
