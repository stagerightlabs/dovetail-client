jest.mock('@/repositories/profile', () => ({
  resendEmailVerificationLink: jest.fn(() => Promise.resolve({
    data: {
        data: {
          message: 'A fresh verification link has been sent to your email address.',
        },
    },
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import ProfileView from '@/views/Profile.vue';
import profile from '@/repositories/profile';
import flushPromises from 'flush-promises';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import merge from 'lodash.merge';
import { User } from '@/types';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VeeValidate, { inject: false, delay: 500 });
config.logModifiedComponents = false;

const fakeUnverifiedUser: User = {
  name: 'Grace Hopper',
  email: 'grace@example.org',
  email_verified_at: null,
  phone: '907.748.2258 x7660',
  phone_verified_at: '2018-09-10T23:09:31+00:00',
  teams: [],
};

describe('Profile.vue', () => {

  const defaultStoreConfig = {
    modules: {
      session: {
        namespaced: true,
        mutations: {
          storeAuthTokenInLocalStorage: jest.fn(),
          setAuthTokenForSession: jest.fn(),
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
    };

    return mount(ProfileView, merge(defaultMountingOptions, overrides));
  }

  test('the profile page can be viewed', async () => {
    const store = createStore({
      modules: {
        session: {
          getters: {
            user: () => fakeUnverifiedUser,
          },
        },
      },
    });
    const wrapper = createWrapper({store});

    expect(wrapper.text()).toContain('Your email address has not been verified');
    wrapper.find('#link-resend-email').trigger('click');
    expect(profile.resendEmailVerificationLink).toHaveBeenCalled();
  });

});
