jest.mock('@/repositories/notebooks', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
        data: [fakeNotebook],
    },
  })),
  create: jest.fn((name) => Promise.resolve({
    data: {
      data: fakeNotebook,
    },
  })),
}));
jest.mock('@/repositories/categories', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
      data: [fakeCategory],
    },
  })),
}));
jest.mock('@/repositories/profile', () => ({
  teams: jest.fn(() => Promise.resolve({
    data: [],
  })),
  notebooks: jest.fn(() => Promise.resolve({
    data: {
      data: [fakeNotebook],
    },
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { Notebook, User, Organization, Category } from '@/types';
import NotebookIndexView from '@/views/Notebooks.vue';
import notebooks from '@/repositories/notebooks';
import profile from '@/repositories/profile';
import flushPromises from 'flush-promises';
import Icon from '@/components/Icon.vue';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
localVue.use(VeeValidate, { inject: false, delay: 500, validity: true });
localVue.component('icon', Icon);
config.logModifiedComponents = false;

const fakeNotebook: Notebook = {
  hashid: 'wy5dn36',
  name: 'Experiment 24601',
  slug: 'experiment-24601',
  category: 'Experiments',
  category_id: 'wy5dn36',
  owner_name: 'Hopper Labs',
  comments_enabled: true,
  current_user_is_following: true,
};

const fakeOrganization: Organization = {
  hashid: 'x737zq8',
  name: 'Hopper Labs',
  slug: 'hopper-labs',
  logo_url: null,
  settings: [
    {
      key: 'label.notebooks',
      value: 'Notebooks',
    },
  ],
};

const fakeUser: User = {
  hashid: 'user-hashid',
  name: 'Grace Hopper',
  email: 'grace@example.org',
  email_verified_at: '2018-09-10T23:09:31+00:00',
  phone: '907.748.2258 x7660',
  phone_verified_at: '2018-09-10T23:09:31+00:00',
  teams: [],
};

const fakeCategory: Category = {
  hashid: 'category-hashid',
  name: 'Polymerase',
};

describe('Notebooks.vue', () => {

  const defaultStoreConfig = {
    modules: {
      session: {
        namespaced: true,
        getters: {
          organization: jest.fn(() => fakeOrganization),
          user: jest.fn(() => fakeUser),
          orgNotebooksLabel: jest.fn(() => fakeOrganization.settings![0].value),
          isAdministrator: () => false,
        },
      },
    },
  };

  function createStore(overrides: any = {}) {
    return new Vuex.Store(merge(defaultStoreConfig, overrides));
  }

  function createWrapper(overrides: any) {

    const defaultMountingOptions = {
      stubs: {
        RouterLink: RouterLinkStub,
      },
      router: new VueRouter({
        routes: [
          {
            path: '/notebooks',
            name: 'notebooks',
          },
          {
            path: '/notebooks/:hashid/:slug',
            name: 'notebook',
            props: true,
          },
        ],
      }),
      localVue,
      store: createStore(),
      sync: false,
    };

    return mount(NotebookIndexView, merge(defaultMountingOptions, overrides));
  }

  test('the notebooks index can be viewed by regular users', async () => {
    const wrapper = createWrapper({});

    await flushPromises();
    expect(profile.notebooks).toHaveBeenCalled();
    expect(wrapper.vm.$data.notebooks.length).toBe(1);
  });

  test('the notebooks index can be viewed by administrators', async () => {
    const store = createStore({
      modules: {
        session: {
          namespaced: true,
          getters: {
            isAdministrator: () => true,
          },
        },
      },
    });
    const wrapper = createWrapper({});

    await flushPromises();
    expect(notebooks.index).toHaveBeenCalled();
    expect(wrapper.vm.$data.notebooks.length).toBe(1);
  });

  test('the notebook index page links to notebook detail page', async () => {
    const wrapper = createWrapper({});
    await flushPromises();

    expect(wrapper.find(RouterLinkStub).props().to.params).toEqual({
      hashid: fakeNotebook.hashid,
      slug: fakeNotebook.slug,
    });
  });

  test('a new notebook can be created', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      notebooks: [],
      loading: false,
      creationFormVisible: true,
    });
    await flushPromises();

    const nameInput = wrapper.find('#new-notebook-name');
    nameInput.setValue('Lab Notebook');
    const categoryInput = wrapper.find('#new-notebook-category');
    categoryInput.setValue(fakeCategory.hashid);
    wrapper.find('#btn-create').trigger('click');

    await flushPromises();
    expect(notebooks.create).toHaveBeenCalledWith({
      category_id: fakeCategory.hashid,
      name: 'Lab Notebook',
      owner_id: fakeUser.hashid,
    });
  });

  test('new notebooks require a name', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      notebooks: [],
      loading: false,
      creationFormVisible: true,
    });
    await flushPromises();

    const nameInput = wrapper.find('#new-notebook-name');
    nameInput.setValue('');
    wrapper.find('#btn-create').trigger('click');

    await flushPromises();
    expect(notebooks.create).not.toHaveBeenCalled();
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });
});
