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

import { faSpinner, faEdit, faSyncAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import notebooks from '@/repositories/notebooks';
import NotebookView from '@/views/Notebook.vue';
import flushPromises from 'flush-promises';
import { Notebook, Member } from '@/types';
import cloneDeep from 'lodash.clonedeep';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';

const localVue = createLocalVue();
localVue.use(VeeValidate, { inject: false, delay: 500 });
localVue.component('fa-icon', FontAwesomeIcon);
localVue.use(VueRouter);
library.add(faSpinner);
library.add(faEdit);
library.add(faSyncAlt);
library.add(faTrashAlt);
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

});
