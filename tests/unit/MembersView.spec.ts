jest.mock('@/repositories/members', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
        data: fakeMembers,
    },
  })),
  deletedMembers: jest.fn(() => Promise.resolve({
    data: {
      data: fakeDeletedMembers,
    }
  })),
  update: jest.fn((member) => Promise.resolve({
    data: {
      data: fakeMember,
    }
  })),
  delete: jest.fn((member) => Promise.resolve({
    data: {}
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import MembersView from '@/views/Members.vue';
import members from '@/repositories/members';
import flushPromises from 'flush-promises';
import cloneDeep from 'lodash.clonedeep';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import merge from 'lodash.merge';
import { Member } from '@/types';


const localVue = createLocalVue();
localVue.use(VeeValidate, { inject: false, delay: 500, validity: true });
config.logModifiedComponents = false;

const fakeMember: Member = {
    hashid: 'wy5dn36',
    name: 'Grace Hopper',
    email: 'hopper@example.com',
    rank: 'Admin',
    title: 'Technologist Level III',
    phone: '(705) 558-7119 x38444',
    email_verified: true,
    phone_verified: true,
    teams: [],
    created_at: '2018-09-14T03:45:26+00:00',
};

const fakeDeletedMember: Member = {
  hashid: 'wy5dn36',
  name: 'Grace Hopper',
  email: 'hopper@example.com',
  rank: 'Admin',
  title: 'Technologist Level III',
  phone: '(705) 558-7119 x38444',
  email_verified: true,
  phone_verified: true,
  teams: [],
  created_at: '2018-09-14T03:45:26+00:00',
  deleted_at: '2018-09-14T03:45:26+00:00',
};

const fakeMembers = [fakeMember];
const fakeDeletedMembers = [fakeDeletedMember];

describe('Members.vue', () => {

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
      sync: false,
    };

    return mount(MembersView, merge(defaultMountingOptions, overrides));
  }

  test('the members index can be viewed', async () => {
    const wrapper = createWrapper({});

    await flushPromises();
    expect(members.index).toHaveBeenCalled();
    expect(wrapper.vm.$data.members.length).toBe(1);
    expect(members.deletedMembers).toHaveBeenCalled();
    expect(wrapper.vm.$data.deletedMembers.length).toBe(1);
  });

  test('a member can be selected for editing', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({members: fakeMembers, loading: false});
    await flushPromises();

    wrapper.find('#btn-edit').trigger('click');
    await flushPromises();

    expect(wrapper.vm.$data.editing.hashid).toBe(fakeMember.hashid);
  });

  test('member editing can be cancelled', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      members: fakeMembers,
      loading: false,
      editing: cloneDeep(fakeMember),
    });
    await flushPromises();

    wrapper.find('#btn-cancel').trigger('click');
    await flushPromises();

    expect(wrapper.vm.$data.editing).toBe(null);
    expect(members.update).not.toHaveBeenCalled();
  });

  // Test that new invitations require an email address
  test('members require an email address', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      members: fakeMembers,
      loading: false,
      editing: cloneDeep(fakeMember),
    });
    await flushPromises();

    const emailInput = wrapper.find('#text-email');
    emailInput.setValue('');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();

    expect(members.update).not.toHaveBeenCalled();
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  test('members require a name', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      members: fakeMembers,
      loading: false,
      editing: fakeMember,
    });
    await flushPromises();

    const nameInput = wrapper.find('#text-name');
    nameInput.setValue('');
    wrapper.find('#btn-update').trigger('click');

    await flushPromises();

    expect(members.update).not.toHaveBeenCalled();
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  // A member can be updated
  test('A member can be updated', async () => {
    const updatedMember = cloneDeep(fakeMember);
    updatedMember.email = 'newemail@example.com';
    updatedMember.name = 'Admiral Hopper';

    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      members: fakeMembers,
      loading: false,
      editing: fakeMember,
    });
    await flushPromises();

    const nameInput = wrapper.find('#text-name');
    nameInput.setValue(updatedMember.name);
    const emailInput = wrapper.find('#text-email');
    emailInput.setValue(updatedMember.email);
    wrapper.find('#btn-update').trigger('click');

    await flushPromises();
    expect(members.update).toHaveBeenCalledWith(updatedMember);
    expect(wrapper.vm.$validator.errors.items).toHaveLength(0);
  });

  // A member can be deleted
  test('A member can be deleted', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    wrapper.setData({
      members: fakeMembers,
      loading: false,
    });
    await flushPromises();

    wrapper.find('#btn-delete').trigger('click');

    await flushPromises();

    expect(members.delete).toHaveBeenCalledWith(fakeMember);
    expect(wrapper.vm.$data.members.length).toBe(0);
  });

});
