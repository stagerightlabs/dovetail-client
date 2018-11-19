jest.mock('@/repositories/session', () => ({
  requestPasswordReset: jest.fn(() => Promise.resolve({
    data: {
      message: 'We have e-mailed your password reset link!',
    },
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import ForgotPassword from '@/views/session/ForgotPassword.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import flushPromises from 'flush-promises';
import http from '@/repositories/session';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VeeValidate, { inject: false, delay: 1 });
localVue.component('fa-icon', FontAwesomeIcon);
library.add(faSpinner);
config.logModifiedComponents = false;

describe('ForgotPassword.vue', () => {

  function createWrapper(overrides: any) {

    const defaultMountingOptions = {
      stubs: {
        RouterLink: RouterLinkStub,
      },
      localVue,
      router: new VueRouter({
        routes: [
          {
            path: '/forgot-password',
            name: 'forgotPassword',
          },
          {
            path: '/login',
            name: 'login',
          },
        ],
      }),
      sync: false,
    };

    return mount(ForgotPassword, merge(defaultMountingOptions, overrides));
  }

  test('a user can request a password reset', async () => {
    const wrapper = createWrapper({});
    wrapper.vm.$router.push({ path: '/forgot-password' });

    const emailInput = wrapper.find('input[type="email"]');
    emailInput.setValue('email@example.com');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();
    expect(http.requestPasswordReset).toHaveBeenCalledWith({email: 'email@example.com'});
    expect(wrapper.vm.$route.path).toEqual('/login');
  });

  test('the email field is required', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.vm.$router.push({path: '/forgot-password'});

    wrapper.find({name: 'ActionButton'}).trigger('click');

    await flushPromises();
    expect(http.requestPasswordReset).not.toHaveBeenCalled();
    expect(wrapper.vm.$route.path).not.toEqual('/login');
  });
});
