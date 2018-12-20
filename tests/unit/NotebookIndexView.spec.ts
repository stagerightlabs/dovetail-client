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

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import NotebookIndexView from '@/views/Notebooks.vue';
import notebooks from '@/repositories/notebooks';
import flushPromises from 'flush-promises';
import { Notebook, Member } from '@/types';
import Icon from '@/components/Icon.vue';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VeeValidate, { inject: false, delay: 500, validity: true });
localVue.component('icon', Icon);
config.logModifiedComponents = false;

const fakeNotebook: Notebook = {
  hashid: 'wy5dn36',
  name: 'Experiment 24601',
  category: 'Experiments',
  category_id: 'wy5dn36',
  comments_enabled: true,
  current_user_is_following: true,
};

describe('Notebooks.vue', () => {

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
            path: '/notebooks/:hashid',
            name: 'notebook',
          },
        ],
      }),
      localVue,
      sync: false,
    };

    return mount(NotebookIndexView, merge(defaultMountingOptions, overrides));
  }

  test('the notebooks index can be viewed', async () => {
    const wrapper = createWrapper({});

    await flushPromises();
    expect(notebooks.index).toHaveBeenCalled();
    expect(wrapper.vm.$data.notebooks.length).toBe(1);
  });

  test('the notebook index page links to notebook detail page', async () => {
    const wrapper = createWrapper({});
    await flushPromises();

    wrapper.find('#btn-show').trigger('click');

    expect(wrapper.vm.$route.path).toEqual(`/notebooks/${fakeNotebook.hashid}`);
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
    nameInput.setValue('Blue Notebook');
    wrapper.find('#btn-create').trigger('click');

    await flushPromises();
    expect(notebooks.create).toHaveBeenCalledWith('Blue Notebook');
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
