jest.mock('@/repositories/session', () => ({
  register: jest.fn(() => Promise.resolve({
    data: fakeToken,
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import Register from '@/views/session/Register.vue';
import flushPromises from 'flush-promises';
import http from '@/repositories/session';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
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
localVue.use(VeeValidate, { inject: false, delay: 1, validity: true });
localVue.component('fa-icon', FontAwesomeIcon);
library.add(faSpinner);
config.logModifiedComponents = false;

describe('Register.vue', () => {

  const defaultStoreConfig = {
    modules: {
      session: {
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

    return mount(Register, merge(defaultMountingOptions, overrides));
  }

  test('a user can register in', async () => {
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    wrapper.find('#text-organization').setValue('Stage Right Labs');
    wrapper.find('#text-name').setValue('Ryan Durham');
    wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    wrapper.find('#password-password').setValue('secret');
    wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();
    expect(http.register).toHaveBeenCalled();
    expect(store.commit).toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.count()).toBe(0);
    wrapper.vm.$validator.errors.clear();
  });

  test('the organization name field is required', async () => {
    jest.clearAllMocks();
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    // wrapper.find('#text-organization').setValue('Stage Right Labs');
    wrapper.find('#text-name').setValue('Ryan Durham');
    wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    wrapper.find('#password-password').setValue('secret');
    wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();
    expect(http.register).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).not.toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  test('the user name field is required', async () => {
    jest.clearAllMocks();
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    wrapper.find('#text-organization').setValue('Stage Right Labs');
    // wrapper.find('#text-name').setValue('Ryan Durham');
    wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    wrapper.find('#password-password').setValue('secret');
    wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();
    expect(http.register).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).not.toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  test('the email field is required', async () => {
    jest.clearAllMocks();
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    wrapper.find('#text-organization').setValue('Stage Right Labs');
    wrapper.find('#text-name').setValue('Ryan Durham');
    // wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    wrapper.find('#password-password').setValue('secret');
    wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();
    expect(http.register).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).not.toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  test('the password field is required', async () => {
    jest.clearAllMocks();
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    wrapper.find('#text-organization').setValue('Stage Right Labs');
    wrapper.find('#text-name').setValue('Ryan Durham');
    wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    // wrapper.find('#password-password').setValue('secret');
    wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find({name: 'ActionButton'}).trigger('click');

    await flushPromises();
    expect(http.register).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).not.toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  test('the password confirmation field is required', async () => {
    jest.clearAllMocks();
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    wrapper.find('#text-organization').setValue('Stage Right Labs');
    wrapper.find('#text-name').setValue('Ryan Durham');
    wrapper.find('#text-email').setValue('ryan@stagerightlabs.com');
    wrapper.find('#password-password').setValue('secret');
    // wrapper.find('#password-confirmation').setValue('secret');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();
    expect(http.register).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalledWith('session/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).not.toHaveBeenCalledWith('session/setAuthTokenForSession', fakeToken);
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });
});
