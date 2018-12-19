import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import store from './store/index';
import PortalVue from 'portal-vue';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';

// Register the VeeValidate plugin
const dictionary = {
  custom: {
    password_confirmation: {
      required: 'The password confirmation field is required.',
    },
  },
};
VeeValidate.Validator.localize('en', dictionary);
Vue.use(VeeValidate, { inject: false, delay: 500, validity: true });

// Register the Portal Vue plugin
Vue.use(PortalVue);

// Install vue a11y helper when not in production
// if (process.env.NODE_ENV !== 'production') {
  //   // tslint:disable-next-line
//   const VueAxe = require('vue-axe')
//   Vue.use(VueAxe, {
//     config: {
//       rules: [],
//     },
//   });
// }

Vue.config.productionTip = false;

// Attempt to read credentials from local storage
store.dispatch('session/tryAutoLogin');

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
