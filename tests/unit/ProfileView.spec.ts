jest.mock('@/repositories/profile', () => ({
  resendEmailVerificationLink: jest.fn(() => Promise.resolve({
    data: {
        data: {
          message: 'A fresh verification link has been sent to your email address.',
        },
    },
  })),
  updateProfile: jest.fn(() => Promise.resolve({
    data: {
      data: fakeUnverifiedUser,
    },
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import ProfileView from '@/views/Profile.vue';
import profile from '@/repositories/profile';
import flushPromises from 'flush-promises';
import { config } from '@vue/test-utils';
import Icon from '@/components/Icon.vue';
import VeeValidate from 'vee-validate';
import merge from 'lodash.merge';
import { User } from '@/types';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VeeValidate, { inject: false, delay: 500 });
localVue.component('icon', Icon);
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

  test('a user profile can be updated', async () => {
    const store = createStore({
      modules: {
        session: {
          getters: {
            user: () => fakeUnverifiedUser,
          },
        },
      },
    });
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    const user = {
      name: 'Admiral Hopper',
      email: 'test@example.com',
      email_verified_at: null,
      phone: '907.748.2258 x7660',
      phone_verified_at: '2018-09-10T23:09:31+00:00',
      teams: [],
    }

    wrapper.find('#input-email').setValue(user.email);
    wrapper.find('#input-name').setValue(user.name);
    // wrapper.find('#input-phone').setValue('(123) 456-7890');
    wrapper.find('#btn-submit').trigger('click');

    await flushPromises();
    expect(store.commit).toHaveBeenCalled();
    expect(profile.updateProfile).toHaveBeenCalledWith(user);
  });

});
