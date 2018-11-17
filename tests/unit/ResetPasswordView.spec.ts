jest.mock('@/repositories/session', () => ({
  changePassword: jest.fn(() => Promise.resolve({
    data: fakeToken,
  })),
}));

import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ResetPassword from '@/views/session/ResetPassword.vue';
import flushPromises from 'flush-promises';
import VeeValidate from 'vee-validate';
import http from '@/repositories/session';
import { AuthToken } from '@/types';
import merge from 'lodash.merge';
import Vuex from 'vuex';

const fakeToken: AuthToken = {
  token_type: 'Bearer',
  expires_in: 31536000,
  access_token: 'eyJ0eXAiOiJKV1QiLCJhbGc...',
  refresh_token: 'def50200641f136a0811...',
};

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VeeValidate, { inject: false, delay: 1 });
localVue.component('fa-icon', FontAwesomeIcon);

describe('Register.vue', () => {

  const defaultStoreConfig = {
    modules: {
      auth: {
        namespaced: true,
        mutations: {
          storeAuthTokenInLocalStorage: jest.fn(),
          setAuthTokenForSession: jest.fn(),
        },
        state: {
          comments: {},
          item: {},
        },
      },
    },
  };

  function createStore(overrides: any = {}) {
    return new Vuex.Store(merge(defaultStoreConfig, overrides));
  }

  function createWrapper(overrides: any) {

    const defaultMountingOptions = {
      propsData: {
        token: 'fake-token',
      },
      mocks: {
        $route: {
          params: {},
        },
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
      localVue,
      store: createStore(),
      sync: false,
    };

    return shallowMount(ResetPassword, merge(defaultMountingOptions, overrides));
  }

  test('a user can register in', async () => {
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    wrapper.find('#password-password').setValue('secret');
    wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find('button').trigger('click');

    await flushPromises();
    expect(wrapper.props().token).toBe('fake-token');
    expect(http.changePassword).toHaveBeenCalled();
    expect(store.commit).toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.count()).toBe(0);
    wrapper.vm.$validator.errors.clear();
  });

  test('the email field is required', async () => {
    jest.resetAllMocks();
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    // wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    wrapper.find('#password-password').setValue('secret');
    wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find('button').trigger('click');

    await flushPromises();
    expect(http.changePassword).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).not.toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  test('the password field is required', async () => {
    jest.resetAllMocks();
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    // wrapper.find('#password-password').setValue('secret');
    wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find('button').trigger('click');

    await flushPromises();
    expect(http.changePassword).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).not.toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  test('the password confirmation field is required', async () => {
    jest.resetAllMocks();
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    wrapper.find('#password-password').setValue('secret');
    // wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find('button').trigger('click');

    await flushPromises();
    expect(http.changePassword).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).not.toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });
});