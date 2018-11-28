jest.mock('@/repositories/profile', () => ({
verifyEmail: jest.fn(() => Promise.resolve({
    data: {
      data: {
        message: 'Thank you for verifying your email address',
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
import session from '@/repositories/session';
import flushPromises from 'flush-promises';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import merge from 'lodash.merge';
import { User } from '@/types';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
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
      propsData: {
        code: 'fake-email-code',
      },
    };

    return mount(VerifyEmailView, merge(defaultMountingOptions, overrides));
  }

  test('it makes email verification requests', async () => {
    // const store = createStore({
    //   modules: {
    //     session: {
    //       actions: {
    //         getUser: jest.fn()
    //       }
    //     },
    //   },
    // });
    const wrapper = createWrapper({});

    expect(profile.verifyEmail).toHaveBeenCalledWith({code: 'fake-email-code'});
  });

});
