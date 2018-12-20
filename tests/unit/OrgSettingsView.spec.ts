jest.mock('@/repositories/settings', () => ({
  writeSetting: jest.fn((key: string, value: string) => Promise.resolve({
    data: {},
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import OrgSettingsView from '@/views/OrgSettings.vue';
import settings from '@/repositories/settings';
import flushPromises from 'flush-promises';
import Icon from '@/components/Icon.vue';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import { Organization } from '@/types';
import merge from 'lodash.merge';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VeeValidate, { inject: false, delay: 500 });
localVue.component('icon', Icon);
config.logModifiedComponents = false;

const fakeOrganization: Organization = {
  hashid: 'x737zq8',
  name: 'Hopper Labs',
  slug: 'hopper-labs',
  logo_url: null,
  settings: [
    {
      key: 'label.plates',
      value: 'Plates',
    },
    {
      key: 'label.notebooks',
      value: 'Notebooks',
    }
  ],
};

describe('OrgSettings.vue', () => {

  const defaultStoreConfig = {
    modules: {
      session: {
        namespaced: true,
        getters: {
          organization: jest.fn(() => fakeOrganization)
        },
        store: {
          organization: fakeOrganization,
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

    return mount(OrgSettingsView, merge(defaultMountingOptions, overrides));
  }

  test('the org settings page can be viewed', async () => {
    const orgGetter = jest.fn(() => fakeOrganization);
    const store = createStore({
      modules: {
        session: {
          getters: {
            organization: orgGetter,
          },
        },
      },
    });
    const wrapper = createWrapper({ store });

    expect(wrapper.text()).toContain('Organization Settings');
    expect(orgGetter).toHaveBeenCalled();
  });

  test('an organization setting can be updated', async () => {
    const store = createStore({
      modules: {
        session: {
          getters: {
            organization: jest.fn(() => fakeOrganization),
          },
        },
      },
    });
    store.commit = jest.fn(() => Promise.resolve());
    const wrapper = createWrapper({ store });

    wrapper.find('#input-label-notebooks').setValue('new label');
    wrapper.find('#btn-submit').trigger('click');

    await flushPromises();
    expect(store.commit).toHaveBeenCalled();
    expect(settings.writeSetting).toHaveBeenCalledWith('label.notebooks', 'new label');
  });

});
