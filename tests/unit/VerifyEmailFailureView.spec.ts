jest.mock('@/repositories/profile', () => ({
verifyEmail: jest.fn(() => Promise.reject({
    data: {
      data: {
        message: 'There was a problem',
      },
    },
  })),
}));
jest.mock('@/repositories/session', () => ({
  getUser: jest.fn(() => Promise.resolve({
    data: fakeVerifiedUser,
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import VerifyEmailView from '@/views/VerifyEmail.vue';
import profile from '@/repositories/profile';
import { config } from '@vue/test-utils';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';
import { User } from '@/types';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
localVue.component('fa-icon', FontAwesomeIcon);
library.add(faSpinner);
config.logModifiedComponents = false;

const fakeUnverifiedUser: User = {
  name: 'Grace Hopper',
  email: 'grace@example.org',
  email_verified_at: null,
  phone: '907.748.2258 x7660',
  phone_verified_at: '2018-09-10T23:09:31+00:00',
  teams: [],
};

const fakeVerifiedUser: User = {
  name: 'Grace Hopper',
  email: 'grace@example.org',
  email_verified_at: '2018-09-10T23:09:31+00:00',
  phone: '907.748.2258 x7660',
  phone_verified_at: '2018-09-10T23:09:31+00:00',
  teams: [],
};

describe('Profile.vue', () => {

  const defaultStoreConfig = {
    modules: {
      session: {
        namespaced: true,
        actions: {
          getUser: jest.fn(),
        },
        mutations: {
          saveSessionUser: jest.fn(),
        },
        getters: {
          user: jest.fn(),
        },
        store: {
          user: {},
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

      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
      localVue,
      router: new VueRouter({
        routes: [
          {
            path: '/profile',
            name: 'profile',
          },
        ],
      }),
      store: createStore(),
      sync: false,
      propsData: {
        code: 'fake-email-code',
      },
    };

    return mount(VerifyEmailView, merge(defaultMountingOptions, overrides));
  }

  test('it handles failed email verification requests', async () => {
    const store = createStore();
    store.commit = jest.fn(() => Promise.resolve());
    createWrapper({ store });

    expect(profile.verifyEmail).toHaveBeenCalledWith({ code: 'fake-email-code' });
    expect(store.commit).not.toHaveBeenCalled();
  });

});
