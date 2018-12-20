jest.mock('@/repositories/categories', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
        data: [fakeCategory],
    },
  })),
  create: jest.fn((name: string) => Promise.resolve({
    data: {
      data: fakeCategory,
    },
  })),
  update: jest.fn((category: Category) => Promise.resolve({
    data: {
      data: category,
    },
  })),
  delete: jest.fn((category: Category) => Promise.resolve()),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import CategoriesView from '@/views/Categories.vue';
import categories from '@/repositories/categories';
import flushPromises from 'flush-promises';
import cloneDeep from 'lodash.clonedeep';
import { config } from '@vue/test-utils';
import Icon from '@/components/Icon.vue';
import VeeValidate from 'vee-validate';
import { Category } from '@/types';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VeeValidate, { inject: false, delay: 500 });
localVue.component('icon', Icon);
config.logModifiedComponents = false;

const fakeCategory: Category = {
  hashid: 'wy5dn36',
  name: 'Polymerase',
};

describe('Teams.vue', () => {

  function createWrapper(overrides: any) {

    const defaultMountingOptions = {
      stubs: {
        RouterLink: RouterLinkStub,
      },
      router: new VueRouter({
        routes: [
          {
            path: '/teams',
            name: 'teams',
          },
          {
            path: '/teams/:hashid',
            name: 'team',
          },
        ],
      }),
      localVue,
      sync: false,
    };

    return mount(CategoriesView, merge(defaultMountingOptions, overrides));
  }

  test('the categories index can be viewed', async () => {
    const wrapper = createWrapper({});

    await flushPromises();
    expect(categories.index).toHaveBeenCalled();
    expect(wrapper.vm.$data.categories.length).toBe(1);
  });

  test('a new category can be added', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      categories: [],
      loading: false,
      creationFormVisible: true,
    });
    await flushPromises();

    const nameInput = wrapper.find('#new-category-name');
    nameInput.setValue('Polymerase');
    wrapper.find('#btn-create').trigger('click');

    await flushPromises();
    expect(categories.create).toHaveBeenCalledWith('Polymerase');
  });

  test('a category can be edited', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    await flushPromises();

    wrapper.find('#btn-edit').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#text-name').isVisible()).toBe(true);

  });

  test('a category can be updated', async () => {
    jest.clearAllMocks();
    const editedCategory = cloneDeep(fakeCategory);
    editedCategory.name = 'New Name';
    const wrapper = createWrapper({});
    wrapper.setData({
      categories: [fakeCategory],
      loading: false,
      editing: editedCategory,
    });
    await flushPromises();

    const nameInput = wrapper.find('#text-name');
    nameInput.setValue('New Name');
    wrapper.find('#btn-update').trigger('click');
    await flushPromises();

    expect(categories.update).toHaveBeenCalledWith(editedCategory);
  });

  test('a category can be updated', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      categories: [fakeCategory],
      loading: false,
    });
    await flushPromises();

    wrapper.find('#btn-delete').trigger('click');
    await flushPromises();

    expect(categories.delete).toHaveBeenCalledWith(fakeCategory);
  });
});
