jest.mock('@/repositories/invitations', () => ({
  index: jest.fn(() => Promise.resolve({
    data: {
        data: fakeInvitations
    },
  })),
  create: jest.fn(() => Promise.resolve({
    data: {
      data: fakeInvitation
    },
  })),
}));

import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner, faPlus, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import invitations from '@/repositories/invitations';
import InvitationView from '@/views/Invitations.vue';
import flushPromises from 'flush-promises';
import { config } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import { Invitation } from '@/types';
import merge from 'lodash.merge';


const fakeInvitation: Invitation = {
  hashid: 'x737zq8',
  email: 'grace@example.com',
  revoked_at: null,
  revoked_by: null,
  completed_at: null,
  created_at: '2018-09-13T00:02:09+00:00',
}

const fakeInvitations: Invitation[] = [fakeInvitation];

const localVue = createLocalVue();
localVue.use(VeeValidate, { inject: false, delay: 500 });
localVue.component('fa-icon', FontAwesomeIcon);
library.add(faSpinner);
library.add(faPlus);
library.add(faSyncAlt);
config.logModifiedComponents = false;

describe('Invitation.vue', () => {

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

});
