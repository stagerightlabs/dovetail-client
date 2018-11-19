<template>
  <div v-if="loading" class="center-xy">
    <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon>
  </div>
  <main v-else role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Invitations</h1>
      <div>
        <button @click="showInvitationForm" class="text-grey-light" id="btn-new">
          <fa-icon icon="plus" ></fa-icon> New
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <fa-icon icon="sync-alt" ></fa-icon> Refresh
        </button>
      </div>
    </div>
    <div v-if="creationFormVisible" class="content flex items-start">
      <label for="new-invitation-email" class="pt-2">Invite:</label>
      <div class="ml-2 flex-grow">
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
          required
          v-validate
        >
        <div class="input-error flex-none">{{ errors.first('email') }}</div>
      </div>
      <action-button

        class="btn btn-green ml-2"
        @click="invite"
        :spin="sendingInvitation"
      >
        Send
      </action-button>
      <button
        class="btn btn-red ml-2"
        @click="cancelNewInvitation"
      >
        Cancel
      </button>
    </div>
    <div class="content">
      <table v-if="invitations.length">
        <thead>
          <tr>
            <th>Email Address</th>
            <th>Sent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invitation in invitations" :key="invitation.hashid">
            <td>{{ invitation.email }}</td>
            <td>{{ invitation.created_at }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center py-24">
        <p class="mb-4">You have not sent any invitations.</p>
        <p v-if="!creationFormVisible">
          <a @click.prevent="showInvitationForm">Send One Now</a>
        </p>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { Invitation } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import invitations from '@/repositories/invitations';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class InvitationView extends mixins(BaseView) {
  invitations: Invitation[] = [];
  creationFormVisible: boolean = false;
  newInvitationEmail: string|null = null;
  sendingInvitation: boolean = false;
  loading: boolean = true;

  $refs!: {
    newInvitationInput: HTMLFormElement
  }

  cancelNewInvitation() {
    this.creationFormVisible = false;
    this.resetInvitationForm();
  }

  resetInvitationForm() {
    this.newInvitationEmail = null;
    this.sendingInvitation = false;
    this.$nextTick(() => this.$validator.errors.clear());
  }

  showInvitationForm() {
    this.creationFormVisible = true;
    this.$nextTick(() => this.$refs.newInvitationInput.focus())
  }

  invite() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
        this.submitInvitationRequest();
        this.sendingInvitation = true;
        }
      })
  }

  submitInvitationRequest() {
    invitations.create({email: this.newInvitationEmail})
      .then((response) => {
        this.invitations.push(response.data.data);
        this.toast({
          message: `An invitation has been sent to ${response.data.data.email}`,
          level: 'success'
        })
        this.resetInvitationForm();
      })
      .then(() => {

      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.sendingInvitation = false;
      })
  }

  private fetchInvitations() {
    invitations.index()
      .then((response) => {
        this.invitations = response.data.data;
        this.loading = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.loading = false;
      })
  }

    refresh() {
    this.loading = true;
    this.fetchInvitations();
  }

  beforeMount() {
    this.fetchInvitations();
  }
}
</script>
