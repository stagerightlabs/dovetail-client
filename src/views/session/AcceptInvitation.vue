<template>
  <div v-if="loading" class="center-xy">
    <icon name="refresh" width="128" height="128" class="text-grey-light" spin></icon>
  </div>
  <main v-else role="main" class="center-xy">
    <div class="billboard">
      <h1 class="mb-4 text-center">Welcome to Dovetail</h1>
      <p class="mb-8 mt-6 leading-normal" v-if="invitedBy">{{ invitedBy }} has invited you to join Dovetail. Let's create your account:</p>
      <p class="mb-8 mt-6 leading-normal" v-else>You have been invited to join Dovetail. Let's create your account:</p>
      <div class="flex justify-between mb-6">
        <label>Email:</label>
        <p>{{ email }}</p>
      </div>
      <div class="input-group">
        <label>Name:</label>
        <input
          type="text"
          id="text-name"
          v-model="name"
          name="name"
          required
          v-validate
        >
        <div class="input-error">{{ errors.first('name') }}</div>
      </div>
      <div class="input-group">
        <label>Password:</label>
        <input
          type="password"
          id="password-password"
          v-model="password"
          name="password"
          required
          v-validate
        >
        <div class="input-error">{{ errors.first('password') }}</div>
      </div>
      <div class="input-group">
        <label>Confirm Password:</label>
        <input
          type="password"
          id="password-confirmation"
          v-model="password_confirmation"
          @keyup.enter="changePassword"
          name="password_confirmation"
          required
          v-validate
        >
        <div class="input-error">{{ errors.first('password_confirmation') }}</div>
      </div>
      <div class="flex items-center justify-end">
        <button class="btn btn-blue" @click="changePassword">
          <span v-if="requestSubmitted" class="mx-7">
            <icon name="refresh" width="20" height="20" spin />
          </span>
          <span v-else>Create Account</span></button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import http from '@/repositories/session';
import { AuthToken, User } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import { State, Mutation } from 'vuex-class';
import { Vue, Prop } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';

@Component({
  $_veeValidate: { validator: "new" }
})
export default class AcceptInvitation extends mixins(BaseView) {
  @Mutation('session/storeAuthTokenInLocalStorage') storeAuthTokenInLocalStorage! : (authToken: AuthToken) => void
  @Mutation('session/setAuthTokenForSession') setAuthTokenForSession! : (authToken: AuthToken) => void
  @Prop({}) code!: string;

  email: string = '';
  name: string = '';
  password: string = '';
  password_confirmation: string = '';
  requestSubmitted: boolean = false;
  loading: boolean = true;
  invalidInvitation: boolean = false;
  invitedBy: string|null = null;

  /**
   * Validate the form data before proceeding
   */
  async changePassword() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitInvitationAcceptance()
        }
      })
  }

  /**
   * Ask the server to complete the invitation
   */
  private submitInvitationAcceptance() {
    this.requestSubmitted = true;
    http.acceptInvitation(this.code, {
      name: this.name,
      password: this.password,
      password_confirmation: this.password_confirmation,
    })
      .then((response) => {
        const authToken: AuthToken = response && response.data;
        this.storeAuthTokenInLocalStorage(authToken);
        this.setAuthTokenForSession(authToken);
        this.toast({
          message: "Your password has been updated.",
          level: 'success'
        });
        this.$router.push({name: 'dashboard'});
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.requestSubmitted = false;
      });
  }

  /**
   * The mounted life cycle hook
   */
  mounted() {
    this.confirmInvitation();
  }

  /**
   * Ask the server to validate an invitation before we proceed
   */
  private confirmInvitation() {
    http.confirmInvitation(this.code)
      .then((response) => {
        this.invitedBy = response.data.data.invitedBy;
        this.email = response.data.data.email;
        this.loading = false;

      })
      .catch((error) => {
        this.invalidInvitation = true;
        this.$router.push({name: '404'});
      })
  }

}
</script>
