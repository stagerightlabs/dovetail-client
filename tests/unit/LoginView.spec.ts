jest.mock('@/repository', () => ({
  httpPostLogin: jest.fn(() => Promise.resolve({
    data: fakeToken,
  })),
}));

import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Login from '@/views/auth/Login.vue';
import flushPromises from 'flush-promises';
import VeeValidate from 'vee-validate';
import repository from '@/repository';
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

describe('Login.vue', () => {

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
    return shallowMount(Login, merge(defaultMountingOptions, overrides));
  }

  test('a user can log in', async () => {
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    const emailInput = wrapper.find('input[type="email"]');
    emailInput.setValue('email@gmail.com');
    const passwordInput = wrapper.find('input[type="password"]');
    passwordInput.setValue('secret');
    wrapper.find('button').trigger('click');

    await flushPromises();
    expect(repository.httpPostLogin).toHaveBeenCalled();
    expect(store.commit).toHaveBeenCalledWith('auth/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).toHaveBeenCalledWith('auth/setAuthTokenForSession', fakeToken);
  });

  test('the password field is required', async () => {
    jest.resetAllMocks();
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');
    emailInput.setValue('fred@gmail.com');
    wrapper.find('button').trigger('click');

    await flushPromises();
    expect(repository.httpPostLogin).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalledWith('auth/storeAuthTokenInLocalStorage', fakeToken);
    expect(store.commit).not.toHaveBeenCalledWith('auth/setAuthTokenForSession', fakeToken);
  });
});
