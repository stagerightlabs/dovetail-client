jest.mock('@/repositories/teams', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
        data: [fakeTeam],
    },
  })),
  create: jest.fn((name) => Promise.resolve({
    data: {
      data: fakeTeam,
    },
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import TeamIndexView from '@/views/Teams.vue';
import flushPromises from 'flush-promises';
import teams from '@/repositories/teams';
import Icon from '@/components/Icon.vue';
import { config } from '@vue/test-utils';
import { Team, Member } from '@/types';
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VeeValidate, { inject: false, delay: 500, validity: true });
localVue.component('icon', Icon);
config.logModifiedComponents = false;

const fakeTeam: Team = {
  hashid: 'wy5dn36',
  name: 'Red Team',
  slug: 'red-team',
  members: [],
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

    return mount(TeamIndexView, merge(defaultMountingOptions, overrides));
  }

  test('the teams index can be viewed', async () => {
    const wrapper = createWrapper({});

    await flushPromises();
    expect(teams.index).toHaveBeenCalled();
    expect(wrapper.vm.$data.teams.length).toBe(1);
  });

  test('the team index page links to team detail page', async () => {
    const wrapper = createWrapper({});
    await flushPromises();

    wrapper.find('#btn-show').trigger('click');

    expect(wrapper.vm.$route.path).toEqual(`/teams/${fakeTeam.hashid}`);
  });

  test('a new team can be created', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      teams: [],
      loading: false,
      creationFormVisible: true,
    });
    await flushPromises();

    const nameInput = wrapper.find('#new-team-name');
    nameInput.setValue('Blue Team');
    wrapper.find('#btn-create').trigger('click');

    await flushPromises();
    expect(teams.create).toHaveBeenCalledWith('Blue Team');
  });

  test('new teams require a name', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      teams: [],
      loading: false,
      creationFormVisible: true,
    });
    await flushPromises();

    const nameInput = wrapper.find('#new-team-name');
    nameInput.setValue('');
    wrapper.find('#btn-create').trigger('click');

    await flushPromises();
    expect(teams.create).not.toHaveBeenCalled();
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });
});
