import Vue from 'vue';
import Router from 'vue-router';
import store from './store/index';
import Home from '@/views/Home.vue';

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
      component: Home,
      children: [
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
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
      beforeEnter: (to, from, next) => {
        store.dispatch('auth/logout');
        next({
          path: '/login'
        });
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ './views/session/Register.vue'),
    },

  ],
});

// Set up global navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.isAuthenticated) {
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
