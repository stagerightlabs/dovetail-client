jest.mock('@/repositories/invitations', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
        data: fakeInvitations,
    },
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import ProfileView from '@/views/Invitations.vue';
import profile from '@/repositories/profile';
import flushPromises from 'flush-promises';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import merge from 'lodash.merge';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VeeValidate, { inject: false, delay: 500 });
config.logModifiedComponents = false;

describe('Profile.vue', () => {

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

    return mount(ProfileView, merge(defaultMountingOptions, overrides));
  }

  test('the profile page can be viewed', async () => {
    const wrapper = createWrapper({});

    await flushPromises();
    expect(profile.index).toHaveBeenCalled();
    expect(wrapper.vm.$data.invitations.length).toBe(1);
    // wrapper.vm.$validator.errors.clear();
  });

  // Test that new invitations are created
  test('new invitations can be sent', async () => {
    const wrapper = createWrapper({});
    await flushPromises();
    wrapper.vm.$data.invitations = [];
    wrapper.find('#btn-new').trigger('click');
    await flushPromises();

    const emailInput = wrapper.find('#new-invitation-email');
    emailInput.setValue('email@example.com');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();
    expect(profile.create).toHaveBeenCalledWith({email: 'email@example.com'});
  });



});
