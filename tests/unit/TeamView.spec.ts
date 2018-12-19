jest.mock('@/repositories/teams', () => ({
  show: jest.fn((hashid: string) => Promise.resolve({
    data: {
      data: fakeTeam,
    },
  })),
  update: jest.fn((team: Team) => Promise.resolve({
    data: {
      data: team,
    },
  })),
  addMember: jest.fn((team: Team, member: Member) => Promise.resolve({
    data: {},
  })),
  removeMember: jest.fn((team: Team, member: Member) => Promise.resolve({
    data: {},
  })),
}));
jest.mock('@/repositories/members', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
      data: [fakeMember],
    },
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import teams from '@/repositories/teams';
import cloneDeep from 'lodash.clonedeep';
import TeamView from '@/views/Team.vue';
import { config } from '@vue/test-utils';
import { Team, Member } from '@/types';
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router';
import merge from 'lodash.merge';

const localVue = createLocalVue();
localVue.use(VeeValidate, { inject: false, delay: 500, validity: true });
localVue.use(VueRouter);
config.logModifiedComponents = false;

const fakeMember: Member = {
  hashid: 'wy5dn36',
  name: 'Grace Hopper',
  email: 'hopper@example.com',
  rank: 'Admin',
  title: 'Technologist Level III',
  email_verified: true,
  phone_verified: false,
  created_at: '2018-09-14T03:45:26+00:00',
};

const fakeTeam: Team = {
  hashid: 'wy5dn36',
  name: 'Red Team',
  members: [fakeMember],
};

describe('Teams.vue', () => {

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

    return mount(TeamView, merge(defaultMountingOptions, overrides));
}

  test('a team can be viewed', async () => {
      const wrapper = createWrapper({});

      await flushPromises();
      expect(teams.show).toHaveBeenCalledWith(fakeTeam.hashid);
      expect(wrapper.vm.$data.team).toBe(fakeTeam);
      expect(wrapper.vm.$data.team.members.length).toBe(1);
  });

  test('a team can be updated', async () => {
    const wrapper = createWrapper({});
    const updatedTeam = cloneDeep(fakeTeam);
    updatedTeam.name = 'New Name';
    wrapper.setData({ editFormVisible: true });
    await flushPromises();

    const nameInput = wrapper.find('#edit-team-name');
    nameInput.setValue(updatedTeam.name);
    wrapper.find('#btn-update').trigger('click');
    await flushPromises();

    expect(teams.update).toHaveBeenCalledWith(updatedTeam);
    expect(wrapper.vm.$data.team).toEqual(updatedTeam);
  });

  test('a team cannot be updated without a name', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({ editFormVisible: true });
    await flushPromises();

    const nameInput = wrapper.find('#edit-team-name');
    nameInput.setValue('');
    wrapper.find('#btn-update').trigger('click');
    await flushPromises();

    await flushPromises();
    expect(teams.update).not.toHaveBeenCalled();
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  test('a team member can be removed', async () => {
    const wrapper = createWrapper({});
    wrapper.setData({ editFormVisible: false });
    await flushPromises();

    wrapper.find('#btn-remove-member').trigger('click');
    await flushPromises();

    expect(teams.removeMember).toHaveBeenCalledWith(fakeTeam, fakeMember);
    expect(wrapper.vm.$data.team.members).toEqual([]);
  });

  test('a team member can be added', async () => {
    const wrapper = createWrapper({});
    const memberlessTeam = cloneDeep(fakeTeam);
    memberlessTeam.members = [];
    wrapper.setData({ editFormVisible: false, loading: false, team: memberlessTeam });
    await flushPromises();

    // wrapper.findAll('button').wrappers.forEach((button) => {
    //   console.log(button.attributes());
    // })

    wrapper.find('#btn-add-member').trigger('click');
    await flushPromises();

    expect(teams.addMember).toHaveBeenCalledWith(fakeTeam, fakeMember);
    expect(wrapper.vm.$data.team.members.length).toEqual(1);
  });
});
