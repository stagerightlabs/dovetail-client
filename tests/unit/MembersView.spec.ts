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
//   create: jest.fn(() => Promise.resolve({
//     data: {
//       data: fakeInvitation,
//     },
//   })),
//   resend: jest.fn(() => Promise.resolve({
//     data: {
//       data: fakeInvitation,
//     },
//   })),
//   revoke: jest.fn(() => Promise.resolve({
//     data: {
//       data: fakeRevokedInvitation,
//     },
//   })),
//   restore: jest.fn(() => Promise.resolve({
//     data: {
//       data: fakeInvitation,
//     },
//   })),
//   delete: jest.fn(() => Promise.resolve({
//     data: {
//       data: {},
//     },
//   })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner, faPlus, faSyncAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import MembersView from '@/views/Members.vue';
import members from '@/repositories/members';
import flushPromises from 'flush-promises';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import merge from 'lodash.merge';
import { Member } from '@/types';


const localVue = createLocalVue();
localVue.use(VeeValidate, { inject: false, delay: 500 });
localVue.component('fa-icon', FontAwesomeIcon);
library.add(faSpinner);
library.add(faPlus);
library.add(faSyncAlt);
library.add(faTrashAlt);
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

  test('the invitations index can be viewed', async () => {
    const wrapper = createWrapper({});

    await flushPromises();
    expect(members.index).toHaveBeenCalled();
    expect(wrapper.vm.$data.members.length).toBe(1);
    expect(members.deletedMembers).toHaveBeenCalled();
    expect(wrapper.vm.$data.deletedMembers.length).toBe(1);
  });

//   // Test that new invitations are created
//   test('new invitations can be sent', async () => {
//     jest.clearAllMocks();
//     const wrapper = createWrapper({});
//     await flushPromises();
//     wrapper.vm.$data.invitations = [];
//     wrapper.find('#btn-new').trigger('click');
//     await flushPromises();
//     // why so many flushPromises() calls?
//     // See here: https://github.com/vuejs/vue-test-utils/issues/829

//     const emailInput = wrapper.find('#new-invitation-email');
//     emailInput.setValue('email@example.com');
//     wrapper.find({ name: 'ActionButton' }).trigger('click');

//     await flushPromises();
//     expect(invitations.create).toHaveBeenCalledWith({email: 'email@example.com'});
//   });

//   // Test that new invitations require an email address
//   test('new invitations require a valid email address', async () => {
//     jest.clearAllMocks();
//     const wrapper = createWrapper({});
//     await flushPromises();
//     wrapper.vm.$data.invitations = [];
//     wrapper.find('#btn-new').trigger('click');
//     await flushPromises();

//     const emailInput = wrapper.find('#new-invitation-email');
//     emailInput.setValue('');
//     wrapper.find({ name: 'ActionButton' }).trigger('click');

//     await flushPromises();

//     expect(invitations.create).not.toHaveBeenCalled();
//     expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
//     wrapper.vm.$validator.errors.clear();
//   });

//   // Test that invitations can be refreshed
//   test('the invitation list can be refreshed', async () => {
//     jest.clearAllMocks();
//     const wrapper = createWrapper({});
//     await flushPromises();

//     wrapper.find('#btn-refresh').trigger('click');
//     await flushPromises();

//     expect(invitations.index).toHaveBeenCalledTimes(2);
//     expect(wrapper.vm.$data.invitations.length).toBe(1);
//   });

//   test('an invitation can be resent', async () => {
//     jest.clearAllMocks();
//     const wrapper = createWrapper({});
//     await flushPromises();

//     wrapper.find('#btn-resend').trigger('click');
//     await flushPromises();

//     expect(invitations.resend).toHaveBeenCalledTimes(1);
//     expect(wrapper.vm.$data.invitations.length).toBe(1);
//   });

//   test('an invitation can be revoked', async () => {
//     jest.clearAllMocks();
//     const wrapper = createWrapper({});
//     await flushPromises();

//     wrapper.find('#btn-revoke').trigger('click');
//     await flushPromises();

//     expect(invitations.revoke).toHaveBeenCalledTimes(1);
//     expect(wrapper.vm.$data.invitations.length).toBe(1);
//   });

//   test('an invitation can be restored', async () => {
//     jest.clearAllMocks();
//     const wrapper = createWrapper({});
//     await flushPromises();

//     wrapper.vm.$data.invitations = [fakeRevokedInvitation];
//     await flushPromises();
//     wrapper.find('#btn-restore').trigger('click');
//     await flushPromises();

//     expect(invitations.restore).toHaveBeenCalledTimes(1);
//     expect(wrapper.vm.$data.invitations.length).toBe(1);
//   });


});
