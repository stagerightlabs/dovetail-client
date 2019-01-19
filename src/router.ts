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
      component: () => import(/* webpackChunkName: "console " */ './views/Console.vue'),
      children: [
        {
          path: '',
          name: 'home',
          beforeEnter: (to, from, next) => {
            if (!store.getters['session/isAuthenticated']) {
              // If there is no active session, redirect to the welcome page
              next({
                path: '/welcome',
              });
            } else {
              // Otherwise redirect to the dashboard
              next({
                path: '/dashboard'
              });
            }
          },
        },
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
          meta: { requiresAuth: true, requiresAdmin: true },
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
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: '/members',
          name: 'members',
          component: () => import(/* webpackChunkName: "members" */ './views/Members.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: '/teams',
          name: 'teams',
          component: () => import(/* webpackChunkName: "teams" */ './views/Teams.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: '/teams/:hashid/:slug',
          name: 'team',
          component: () => import(/* webpackChunkName: "teams" */ './views/Team.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
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
        },
        {
          path: '/forbidden',
          name: '403',
          component: () => import(/* webpackChunkName: "forbidden" */ './views/Forbidden.vue'),
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
      path: '/welcome',
      name: 'welcome',
      component: () => import(/* webpackChunkName: "welcome" */ './views/Welcome.vue'),
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
  // Check to see if the target page is meant for admins only
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    // Check admin status
    if (store.getters['session/isAuthenticated'] && store.getters['session/isAdministrator']) {
      next();
    } else {
      next({
        name: '404',
      });
    }
    // Check to see if the target page requires authorization
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    // check auth status
    if (store.getters['session/isAuthenticated']) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  // Check to see if this route is meant for guests only
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
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
