<template>
  <div v-if="loading" class="center-xy">
    <icon name="refresh" width="128" height="128" class="text-grey-light" spin></icon>
  </div>
  <main v-else role="main" class="page max-w-2xl">
    <header>
      <h1>Profile</h1>
    </header>
    <article>
      <section class="content">
        <div class="max-w-sm m-auto">
          <div class="input-group">
            <label>Name:</label>
            <input
              type="text"
              v-model="user.name"
              name="name"
              id="input-name"
              required
              v-validate
            >
            <div class="input-error">{{ errors.first('name') }}</div>
          </div>
          <div class="input-group">
            <label>Email:</label>
            <input
              type="email"
              v-model="user.email"
              name="email"
              id="input-email"
              required
              v-validate
            >
            <div class="input-error">{{ errors.first('email') }}</div>
          </div>
          <div class="text-right">
            <action-button
              @click="updateProfile"
              id="btn-submit"
              class="btn btn-blue"
              :spin="updating"
            >Update Profile</action-button>
          </div>
        </div>
      </section>
    </article>
    <article>
      <section class="content">
        <p v-if="user.email_verified_at" class="text-lg">
          <icon name="checkmark" class="text-green-dark" />
          Your E-Mail address has been verified.
        </p>
        <p v-else class="text-lg flex justify-between items-baseline">
          <span>
            <icon name="exclamation-outline" class="text-red-dark" />
            Your email address has not been verified.
          </span>
          <action-button
            id="link-resend-email"
            @click="sendVerificationEmail"
            class="btn btn-blue"
            :spin="sendingVerification"
          >Send Verification Email</action-button>
        </p>
      </section>
    </article>
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
  updating: boolean = false;
  sendingVerification: boolean = false;

  /**
   * Ask the api to send a new email verification link
   */
  sendVerificationEmail() {
    this.sendingVerification = true;
    profile.resendEmailVerificationLink()
      .then((response) => {
        this.toast({message: response.data.message, level: 'success'});
        this.sendingVerification = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.sendingVerification = false;
      })
  }

  /**
   * Validate profile data before proceeding
   */
  async updateProfile() {
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
  private requestProfileUpdate() {
    this.updating = true;
    profile.updateProfile(this.user)
      .then((response) => {
        this.saveSessionUser(response.data.data);
        this.toast({
          message: "Your profile has been updated",
          level: 'success'
        });
        this.updating = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.updating = false;
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
