jest.mock('@/repositories/notebooks', () => ({
  show: jest.fn((hashid: string) => Promise.resolve({
    data: {
      data: fakeNotebook,
    },
  })),
  update: jest.fn((notebook: Notebook) => Promise.resolve({
    data: {
      data: notebook,
    },
  })),
}));
jest.mock('@/repositories/pages', () => ({
  create: jest.fn((notebookId: string, content: string) => Promise.resolve({
    data: {
      data: {
        hashid: 'x737zq8',
        notebook_id: 'x737zq8',
        content,
        sort_order: 0,
      },
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

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import categories from '@/repositories/categories';
import notebooks from '@/repositories/notebooks';
import NotebookView from '@/views/Notebook.vue';
import { Notebook, Category } from '@/types';
import flushPromises from 'flush-promises';
import pages from '@/repositories/pages';
import cloneDeep from 'lodash.clonedeep';
import { config } from '@vue/test-utils';
import Icon from '@/components/Icon.vue';
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';

const localVue = createLocalVue();
localVue.use(VeeValidate, { inject: false, delay: 500, validity: true });
localVue.use(VueRouter);
localVue.component('icon', Icon);
config.logModifiedComponents = false;

const fakeNotebook: Notebook = {
  hashid: 'wy5dn36',
  name: 'Experiment 24601',
  slug: 'experiment-24601',
  category: 'Polymerase',
  category_id: 'wy5dn36',
  owner_name: 'Hopper Labs',
  comments_enabled: true,
  current_user_is_following: true,
  pages: []
};

const fakeCategory: Category = {
  hashid: 'wy5dn36',
  name: 'Polymerase',
};


describe('Notebooks.vue', () => {

  function createWrapper(overrides: any) {

    const defaultMountingOptions = {
      propsData: {
        hashid: 'wy5dn36',
      },
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

    return mount(NotebookView, merge(defaultMountingOptions, overrides));
}

  test('a notebook can be viewed', async () => {
      const wrapper = createWrapper({});

      await flushPromises();
      expect(notebooks.show).toHaveBeenCalledWith(fakeNotebook.hashid);
      expect(wrapper.vm.$data.notebook).toBe(fakeNotebook);
  });

  test('a notebook can be updated', async () => {
    const wrapper = createWrapper({});
    const updatedNotebook = cloneDeep(fakeNotebook);
    updatedNotebook.name = 'New Name';
    wrapper.setData({ editFormVisible: true });
    await flushPromises();

    const nameInput = wrapper.find('#edit-notebook-name');
    nameInput.setValue(updatedNotebook.name);
    const categorySelect = wrapper.find('#edit-notebook-category');
    categorySelect.setValue(fakeCategory.hashid);
    wrapper.find('#btn-update').trigger('click');
    await flushPromises();

    expect(notebooks.update).toHaveBeenCalledWith(updatedNotebook);
    expect(wrapper.vm.$data.notebook).toEqual(updatedNotebook);
  });

  test('a notebook cannot be updated without a name', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({ editFormVisible: true });
    await flushPromises();

    const nameInput = wrapper.find('#edit-notebook-name');
    nameInput.setValue('');
    wrapper.find('#btn-update').trigger('click');
    await flushPromises();

    await flushPromises();
    expect(notebooks.update).not.toHaveBeenCalled();
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  test('a notebook page can be added', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    await flushPromises();

    const markdownInput = wrapper.find('#textarea-markdown');
    markdownInput.setValue('#hello world');
    wrapper.find('#btn-save-markdown').trigger('click');
    await flushPromises();

    expect(pages.create).toHaveBeenCalledWith(fakeNotebook.hashid, '#hello world');
  });

});
