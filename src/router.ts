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
          path: '/categories',
          name: 'categories',
          component: () => import(/* webpackChunkName: "categories" */ './views/Categories.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import(/* webpackChunkName: "settings" */ './views/OrgSettings.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/about',
          name: 'about',
          component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/invitations',
          name: 'invitations',
          component: () => import(/* webpackChunkName: "invitations" */ './views/Invitations.vue'),
          meta: { requiresAuth: true, requireAdmin: true },
        },
        {
          path: '/members',
          name: 'members',
          component: () => import(/* webpackChunkName: "members" */ './views/Members.vue'),
          meta: { requiresAuth: true, requireAdmin: true },
        },
        {
          path: '/teams',
          name: 'teams',
          component: () => import(/* webpackChunkName: "teams" */ './views/Teams.vue'),
          meta: { requiresAuth: true, requireAdmin: true },
        },
        {
          path: '/teams/:hashid/:slug',
          name: 'team',
          component: () => import(/* webpackChunkName: "teams" */ './views/Team.vue'),
          meta: { requiresAuth: true, requireAdmin: true },
          props: true,
        },
        {
          path: '/notebooks',
          name: 'notebooks',
          component: () => import(/* webpackChunkName: "notebooks" */ './views/Notebooks.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/notebooks/:hashid/:slug',
          name: 'notebook',
          component: () => import(/* webpackChunkName: "notebook" */ './views/Notebook.vue'),
          meta: { requiresAuth: true },
          props: true,
        }
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
      path: '/verify-email/:code',
      name: 'verifyEmail',
      component: () => import(/* webpackChunkName: "verify-email" */ './views/VerifyEmail.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/invitations/:code',
      name: 'acceptInvitation',
      component: () => import(/* webpackChunkName: "accept-invitation" */ './views/session/AcceptInvitation.vue'),
      props: true,
      meta: { requireGuest: true },
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
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    // we don't want this route to be available to users
    // with active sessions
    if (store.getters['session/isAuthenticated']) {
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
