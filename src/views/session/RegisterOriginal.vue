<template>
  <main role="main" class="center-xy">
    <div class="billboard">
      <h1 class="mb-6 text-center">Register</h1>
      <div class="input-group">
        <label>Organization:</label>
        <input
          type="text"
          id="text-organization"
          v-model="organization"
          name="organization"
          required
          v-validate
          ref="organizationInput"
        >
        <div class="input-error">{{ errors.first('organization') }}</div>
      </div>
      <div class="input-group">
        <label>Your Full Name:</label>
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
        <label>Email:</label>
        <input
          type="text"
          id="text-email"
          v-model="email"
          name="email"
          required
          v-validate
        >
        <div class="input-error">{{ errors.first('email') }}</div>
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
          @keyup.enter="register"
          name="password_confirmation"
          required
          v-validate
        >
        <div class="input-error">{{ errors.first('password_confirmation') }}</div>
      </div>
      <div class="flex items-center justify-end text-right">
        <action-button class="btn btn-slate" @click="register" :spin="registration_submitted">Register</action-button>
      </div>
    </div>
    <div class="bg-grey-darker mt-4 rounded w-full md:w-128 px-8 py-6 text-center">
      <router-link class="text-grey-light font-bold no-underline" :to="{ name: 'login'}">Do you already have an account?</router-link>
    </div>
  </main>
</template>

<script lang="ts">
import { Mutation } from 'vuex-class';
import http from '@/repositories/session';
import { AuthState } from '@/store/types';
import { AuthToken, User } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';
const namespace: string = 'auth';

@Component({
  $_veeValidate: { validator: "new" },
  components: {
    ActionButton
  }
})
export default class RegisterView extends mixins(BaseView) {

  @Mutation('session/storeAuthTokenInLocalStorage') storeAuthTokenInLocalStorage! : (authToken: AuthToken) => void
  @Mutation('session/setAuthTokenForSession') setAuthTokenForSession! : (authToken: AuthToken) => void

  name : string = '';
  organization : string = '';
  email : string = '';
  password : string = '';
  password_confirmation : string = '';
  registration_submitted = false;

  /**
   * Element refs
   */
  $refs: any = {
    organizationInput: HTMLFormElement
  }

  /**
   * Submit a registration request for qualified form data
   */
  register() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
        this.submitRegistration()
        this.registration_submitted = true;
        }
      })
  }

  /**
   * Ask the server to create a new account and auth token
   */
  private submitRegistration() {
    http.register({
      name: this.name,
      organization: this.organization,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
    })
    .then((response) => {
      const authToken: AuthToken = response && response.data;
      this.storeAuthTokenInLocalStorage(authToken);
      this.setAuthTokenForSession(authToken);
      this.$router.push({name: 'dashboard'});
    }).catch((error) => {
      this.handleResponseErrors(error);
      this.registration_submitted = false;
    })
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.$nextTick(() => {
      this.$refs.organizationInput.focus();
    })
  }

}
</script>
