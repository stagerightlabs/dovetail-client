<template>
  <main role="main" class="page">
    <header>
      <h1>Invitations</h1>
      <aside class="p-2 sm:p-0 text-right">
        <button @click="showInvitationForm" class="text-grey-light" id="btn-new">
          <icon name="add-outline"></icon>
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <icon name="refresh" :spin="loading"></icon>
        </button>
      </aside>
    </header>
    <article v-if="creationFormVisible">
      <section class="content">
        <form class="sm:flex items-start">
          <label for="new-invitation-email" class="pt-2 sm:ml-0">Invite:</label>
          <div class="sm:ml-2 flex-grow">
            <input
              type="email"
              name="email"
              class="leading-none"
              id="new-invitation-email"
              placeholder="E-mail Address"
              v-model="newInvitationEmail"
              ref="newInvitationInput"
              @keydown.esc="cancelNewInvitation"
              @keydown.enter="invite"
              v-validate="'required'"
            >
            <div class="input-error flex-none">{{ errors.first('email') }}</div>
          </div>
          <action-button
            class="btn btn-green sm:ml-2 w-full sm:w-auto my-1 sm:my-0"
            @click="invite"
            prevent
            :spin="sendingInvitation"
          >Send</action-button>
          <button
            class="btn btn-red sm:ml-2 w-full sm:w-auto"
            @click.prevent="cancelNewInvitation"
          >Cancel></button>
        </form>
      </section>
    </article>
    <article>
      <section class="content">
        <table class="mt-2" v-if="invitations.length">
          <thead>
            <tr>
              <th data-label="Email Address">Email Address</th>
              <th data-label="First Sent">First Sent</th>
              <th data-label="Accepted" class="text-center">Accepted</th>
              <th data-label="Resend" class="text-center">Resend</th>
              <th data-label="Revoke" class="text-center">Revoke</th>
              <th data-label="Remove" class="text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="invitation in invitations"
              :key="invitation.hashid"
              :class="invitationRowClass(invitation)"
            >
              <td>{{ invitation.email }}</td>
              <td>{{ formattedDate(invitation.created_at) }}</td>
              <td class="text-center">
                <icon name="checkmark" v-if="invitation.completed_at" />
                <span v-if="invitation.revoked_at">Revoked</span>
              </td>
              <td class="text-center">
                <action-button
                  v-if="!invitation.revoked_at && !invitation.completed_at"
                  class="btn btn-green"
                  id="btn-resend"
                  @click="resend(invitation)"
                  :spin="invitation.waitingForPromise === 'resend'"
                >Re-Send</action-button>
              </td>
              <td class="text-center">
                <button
                  v-if="!invitation.revoked_at && !invitation.completed_at"
                  class="btn btn-red"
                  id="btn-revoke"
                  @click="revoke(invitation)"
                >Revoke</button>
                <button
                  v-if="invitation.revoked_at && !invitation.completed_at"
                  class="btn btn-red"
                  id="btn-restore"
                  @click="restore(invitation)"
                >Restore</button>
              </td>
              <td class="text-center">
                <action-button
                  v-if="!invitation.completed_at"
                  class="btn btn-red"
                  id="btn-destroy"
                  @click="destroy(invitation)"
                  :spin="invitation.waitingForPromise === 'delete'"
                  :message="`Remove the '${invitation.email}' invitation?`"
                  :confirm="true"
                >
                  <icon name="trash" />
                </action-button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center py-8">
          <p class="mb-4">
            You have not sent any invitations.
            <span v-if="!creationFormVisible">
              <button @click.prevent="showInvitationForm">Would you like to send one now?</button>
            </span>
          </p>
        </div>
      </section>
    </article>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { format } from 'date-fns';
import { Invitation } from '@/types';
import Icon from '@/components/Icon.vue';
import BaseView from '@/mixins/BaseView.ts';
import invitations from '@/repositories/invitations';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { Icon, ActionButton }
})
export default class InvitationView extends mixins(BaseView) {

  /**
   * Data
   */
  invitations: Invitation[] = [];
  creationFormVisible: boolean = false;
  newInvitationEmail: string|null = null;
  sendingInvitation: boolean = false;
  loading: boolean = true;

  /**
   * Element refs
   */
  $refs!: {
    newInvitationInput: HTMLFormElement
  }

  /**
   * Convert a date into a friendly string format
   */
  formattedDate(date: Date): string {
    return format(date, 'yyyy-MM-dd')
  }

  /**
   * Determine an appropriate row background color for this invitation
   */
  invitationRowClass(invitation: Invitation): string {
    if (invitation.completed_at) {
      return 'success';
    }

    if (invitation.revoked_at) {
      return 'danger'
    }

    return '';
  }

  /**
   * Hide and reset the invitation creation form
   */
  cancelNewInvitation() {
    this.creationFormVisible = false;
    this.resetInvitationForm();
  }

  /**
   * Reset the invitation creation form
   */
  resetInvitationForm() {
    this.newInvitationEmail = null;
    this.sendingInvitation = false;
    this.$nextTick(() => this.$validator.errors.clear());
  }

  /**
   * Make the invitation creation form visible
   */
  showInvitationForm() {
    this.creationFormVisible = true;
    this.$nextTick(() => this.$refs.newInvitationInput.focus())
  }

  /**
   * Ensure our invitation request is valid before making the API call
   */
  invite() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
        this.submitInvitationRequest();
        this.sendingInvitation = true;
        }
      })
  }

  /**
   * Tell the server to send a new invitation
   */
  submitInvitationRequest() {
    invitations.create({email: this.newInvitationEmail})
      .then((response) => {
        this.addOrUpdateModel(this.invitations, this.hydrateInvitation(response.data.data));
        this.toast({
          message: `An invitation has been sent to ${response.data.data.email}`,
          level: 'success'
        })
        this.resetInvitationForm();
      })
      .then(() => {
        this.$nextTick(() => this.$validator.errors.clear());
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.sendingInvitation = false;
      })
  }

  /**
   * Ask the server to re-send an invitation
   */
  resend(invitation: Invitation) {
    invitation.waitingForPromise = 'resend';
    invitations.resend(invitation)
      .then((response) => {
        invitation.waitingForPromise = '';
        this.addOrUpdateModel(this.invitations, this.hydrateInvitation(response.data.data));
        this.toast({
          message: `Re-sent the ${invitation.email} invitation.`,
          level: 'success'
        });
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        invitation.waitingForPromise = '';
      });
  }

  /**
   * Ask the server to revoke an invitation
   */
  revoke(invitation: Invitation) {
    invitations.revoke(invitation)
      .then((response) => {
        this.addOrUpdateModel(this.invitations, this.hydrateInvitation(response.data.data));
        this.toast({
          message: `Revoked the ${invitation.email} invitation.`,
          level: 'success'
        });
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * Ask the server to revoke an invitation
   */
  restore(invitation: Invitation) {
    invitations.restore(invitation)
      .then((response) => {
        this.addOrUpdateModel(this.invitations, this.hydrateInvitation(response.data.data));
        this.toast({
          message: `Restored the ${invitation.email} invitation.`,
          level: 'success'
        });
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * Ask the server to delete an invitation
   */
  destroy(invitation: Invitation) {
    invitation.waitingForPromise = 'delete';
    invitations.delete(invitation)
      .then((response) => {
        this.removeModel(this.invitations, invitation);
        this.toast({
          message: `Deleted the ${invitation.email} invitation.`,
          level: 'success'
        });
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * The user wants to fetch a new copy of the invitation list
   */
  refresh() {
    this.loading = true;
    this.fetchInvitations();
  }

  /**
   * Ask the server for the current list of invitations
   */
  private fetchInvitations() {
    invitations.index()
      .then((response) => {
        this.invitations = response.data.data.map((invitation: Invitation) => this.hydrateInvitation(invitation));
        this.loading = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.loading = false;
      })
  }

  /**
   * Convert an invitation's date strings into date objects
   */
  private hydrateInvitation(invitation: Invitation): Invitation {
    invitation.created_at_date = new Date(invitation.created_at);
    invitation.revoked_at_date = invitation.revoked_at ? new Date(invitation.revoked_at) : null;
    invitation.completed_at_date = invitation.completed_at ? new Date(invitation.completed_at) : null;
    invitation.waitingForPromise = '';
    return invitation;
  }

  /**
   * Before mount Lifecycle hook
   */
  beforeMount() {
    this.fetchInvitations();
  }
}
</script>
