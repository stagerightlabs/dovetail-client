<template>
  <div v-if="loading" class="center-xy">
    <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon>
  </div>
  <main v-else role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Profile</h1>
    </div>
    <div class="content">
      <p>
        {{ user.name }}
      </p>
      <input
        type="text"
        id="input-name"
        name="name"
        v-model="user.name"
        required
        v-validate
      >
      <div class="input-error">{{ errors.first('name') }}</div>
      <p>
        {{ user.email }}
      </p>
      <input
        type="email"
        id="input-email"
        name="email"
        v-model="user.email"
        required
        v-validate
      >
      <div class="input-error">{{ errors.first('email') }}</div>
      <p v-if="user.email_verified_at">Email Verified</p>
      <p v-else>
        Your email address has not been verified.
        <a id="link-resend-email" @click="sendVerificationEmail">Send Verification Email</a>
      </p>
      <button @click="updateProfile" id="btn-submit">Update Profile</button>
    </div>
  </main>
</template>

<script lang="ts">
import { User } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import profile from '@/repositories/profile';
import { Action, Getter, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class ProfileView extends mixins(BaseView) {
  @Mutation('saveSessionUser', {namespace: 'session'}) saveSessionUser! : (user: User) => void;
  @Getter('user', {namespace: 'session'}) user! : User;

  /**
   * Data
   */
  loading: boolean = false;

  /**
   * Ask the api to send a new email verification link
   */
  sendVerificationEmail() {
    profile.resendEmailVerificationLink()
      .then((response) => {
        this.toast({message: response.data.message, level: 'success'})
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Validate profile data before proceeding
   */
  updateProfile() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
        this.requestProfileUpdate()
        }
      })
  }

  /**
   * Submit a profile update request to the server
   */
  requestProfileUpdate() {
    this.loading = true;
    profile.updateProfile(this.user)
      .then((response) => {
        this.saveSessionUser(response.data.data);
        this.toast({
          message: "Your profile has been updated",
          level: 'success'
        });
        this.loading = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.loading = false;
      })
  }

  /**
   * Ensure we have a user profile available before showing the page
   */
  beforeMount() {
    if (this.user !== undefined) {
      this.loading = false;
    }
  }
}
</script>

<style>

</style>
