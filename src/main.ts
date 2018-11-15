import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './registerServiceWorker';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Register FA Icon assets
library.add(faTimes);

// Register the FA icon plugin
Vue.component('fa-icon', FontAwesomeIcon);

// Register the VeeValidate plugin
Vue.use(VeeValidate, { inject: false, delay: 1 });

// Install vue a11y helper, when not in production
if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line
  const VueAxe = require('vue-axe')
  Vue.use(VueAxe, {
    config: {
      // ...
      rules: [
        // { id: 'heading-order', enabled: true },
        // { id: 'label-title-only', enabled: true },
        // and more
      ]
    }
  })
}

Vue.config.productionTip = false;

// Attempt to read credentials from local storage
store.dispatch('auth/tryAutoLogin');

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
