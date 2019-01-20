jest.mock('@/repositories/invitations', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
        data: fakeInvitations,
    },
  })),
  create: jest.fn(() => Promise.resolve({
    data: {
      data: fakeInvitation,
    },
  })),
  resend: jest.fn(() => Promise.resolve({
    data: {
      data: fakeInvitation,
    },
  })),
  revoke: jest.fn(() => Promise.resolve({
    data: {
      data: fakeRevokedInvitation,
    },
  })),
  restore: jest.fn(() => Promise.resolve({
    data: {
      data: fakeInvitation,
    },
  })),
  delete: jest.fn(() => Promise.resolve({
    data: {
      data: {},
    },
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import invitations from '@/repositories/invitations';
import InvitationView from '@/views/Invitations.vue';
import flushPromises from 'flush-promises';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import { Invitation } from '@/types';
import PortalVue from 'portal-vue';
import merge from 'lodash.merge';


const fakeInvitation: Invitation = {
  hashid: 'x737zq8',
  email: 'grace@example.com',
  revoked_at: null,
  revoked_by: null,
  completed_at: null,
  created_at: '2018-09-13T00:02:09+00:00',
};

const fakeRevokedInvitation: Invitation = {
  hashid: 'x737zq8',
  email: 'grace@example.com',
  revoked_at: '2018-09-13T00:02:09+00:00',
  revoked_by: 17,
  completed_at: null,
  created_at: '2018-09-13T00:02:09+00:00',
};

const fakeInvitations: Invitation[] = [fakeInvitation];

const localVue = createLocalVue();
localVue.use(VeeValidate, { inject: false, delay: 500, validity: true });
localVue.use(PortalVue);
config.logModifiedComponents = false;

describe('Invitation.vue', () => {

  function createWrapper(overrides: any) {

    const defaultMountingOptions = {
      mocks: {
        $route: {
          params: {},
          meta: {},
        },
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
      localVue,
      sync: false,
    };

    return mount(InvitationView, merge(defaultMountingOptions, overrides));
  }

  test('the invitations index can be viewed', async () => {
    const wrapper = createWrapper({});

    await flushPromises();
    expect(invitations.index).toHaveBeenCalled();
    expect(wrapper.vm.$data.invitations.length).toBe(1);
    // wrapper.vm.$validator.errors.clear();
  });

  // Test that new invitations are created
  test('new invitations can be sent', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    await flushPromises();
    wrapper.vm.$data.invitations = [];
    wrapper.find('#btn-new').trigger('click');
    await flushPromises();
    // why so many flushPromises() calls?
    // See here: https://github.com/vuejs/vue-test-utils/issues/829

    const emailInput = wrapper.find('#new-invitation-email');
    emailInput.setValue('email@example.com');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();
    expect(invitations.create).toHaveBeenCalledWith({email: 'email@example.com'});
  });

  // Test that new invitations require an email address
  test('new invitations require a valid email address', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    await flushPromises();
    wrapper.vm.$data.invitations = [];
    wrapper.find('#btn-new').trigger('click');
    await flushPromises();

    const emailInput = wrapper.find('#new-invitation-email');
    emailInput.setValue('');
    wrapper.find({ name: 'ActionButton' }).trigger('click');

    await flushPromises();

    expect(invitations.create).not.toHaveBeenCalled();
    expect(wrapper.vm.$validator.errors.items).toHaveLength(1);
    wrapper.vm.$validator.errors.clear();
  });

  // Test that invitations can be refreshed
  test('the invitation list can be refreshed', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    await flushPromises();

    wrapper.find('#btn-refresh').trigger('click');
    await flushPromises();

    expect(invitations.index).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.$data.invitations.length).toBe(1);
  });

  test('an invitation can be resent', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    await flushPromises();

    wrapper.find('#btn-resend').trigger('click');
    await flushPromises();

    expect(invitations.resend).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$data.invitations.length).toBe(1);
  });

  test('an invitation can be revoked', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    await flushPromises();

    wrapper.find('#btn-revoke').trigger('click');
    await flushPromises();

    expect(invitations.revoke).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$data.invitations.length).toBe(1);
  });

  test('an invitation can be restored', async () => {
    jest.clearAllMocks();
    const wrapper = createWrapper({});
    await flushPromises();

    wrapper.vm.$data.invitations = [fakeRevokedInvitation];
    await flushPromises();
    wrapper.find('#btn-restore').trigger('click');
    await flushPromises();

    expect(invitations.restore).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$data.invitations.length).toBe(1);
  });

  /**
   * We can't test the deletion event until we sort out
   * mounting portal targets in the test-utils wrapper
   */
  // test('an invitation can be removed', async () => {
  //   jest.clearAllMocks();
  //   const wrapper = createWrapper({});
  //   await flushPromises();

  //   wrapper.find('#btn-destroy').trigger('click');
  //   await flushPromises();

  //   expect(wrapper.find('#modal-btn-cancel').isVisible()).toBe(true);
  //   expect(wrapper.find('#modal-btn-confirm').isVisible()).toBe(true);

  //   wrapper.find('#modal-btn-confirm').trigger('click');
  //   await flushPromises();

  //   expect(invitations.delete).toHaveBeenCalledTimes(1);
  //   expect(wrapper.vm.$data.invitations.length).toBe(0);
  // });

});
