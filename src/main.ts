import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './registerServiceWorker';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faBars, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Register FA Icon assets
library.add(faTimes);
library.add(faBars);
library.add(faSpinner);

// Register the FA icon plugin
Vue.component('fa-icon', FontAwesomeIcon);

// Register the VeeValidate plugin
const dictionary = {
  custom: {
    password_confirmation: {
      required: 'The password confirmation field is required.',
    },
  },
};
VeeValidate.Validator.localize('en', dictionary);
Vue.use(VeeValidate, { inject: false, delay: 1 });

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
