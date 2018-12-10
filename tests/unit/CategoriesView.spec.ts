jest.mock('@/repositories/categories', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
        data: [fakeCategory],
    },
  })),
  create: jest.fn((name) => Promise.resolve({
    data: {
      data: fakeCategory,
    },
  })),
}));

import { faSpinner, faPlus, faSyncAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import CategoriesView from '@/views/Categories.vue';
import categories from '@/repositories/categories';
import flushPromises from 'flush-promises';
import cloneDeep from 'lodash.clonedeep';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import { Category } from '@/types';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VeeValidate, { inject: false, delay: 500 });
localVue.component('fa-icon', FontAwesomeIcon);
library.add(faSpinner);
library.add(faPlus);
library.add(faSyncAlt);
library.add(faTrashAlt);
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
});
