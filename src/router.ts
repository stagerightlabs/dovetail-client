import Vue from 'vue';
import Router from 'vue-router';
import store from './store/index';

Vue.use(Router);

const scrollBehavior = (to: any, from: any, savedPosition: any) => {
  if (savedPosition) {
    return savedPosition;
  }
  return { x: 0, y: 0 };
};

const router =  new Router({
  mode: 'history',
  scrollBehavior,
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "console " */ './views/Console.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/invitations',
          name: 'invitations',
          // route level code-splitting
          component: () => import(/* webpackChunkName: "invitations" */ './views/Invitations.vue'),
          meta: { requiresAuth: true, requireAdmin: true },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/session/Login.vue'),
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        store.dispatch('session/logout');
        next({
          path: '/login',
        });
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ './views/session/Register.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import(/* webpackChunkName: "forgot-password" */ './views/session/ForgotPassword.vue'),
    },
    {
      path: '/reset-password/:token',
      name: 'resetPassword',
      component: () => import(/* webpackChunkName: "reset-password" */ './views/session/ResetPassword.vue'),
      props: true,
    },
    {
      path: '*',
      name: '404',
      component: () => import(/* webpackChunkName: "reset-password" */ './views/PageNotFound.vue'),
    },
  ],
});

// Set up global navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters['session/isAuthenticated']) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
