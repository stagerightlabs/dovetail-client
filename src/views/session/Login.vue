<template>
  <main role="main" class="center-xy">
    <div class="billboard">
      <h1 class="mb-6 text-center">Login</h1>
      <div class="input-group">
        <label>Email:</label>
        <input
          type="email"
          v-model="email"
          name="email"
          required
          v-validate
          ref="emailInput"
        >
        <div class="input-error">{{ errors.first('email') }}</div>
      </div>
      <div class="input-group">
        <label>Password:</label>
        <input
          type="password"
          v-model="password"
          name="password"
          v-validate
          required
          @keyup.enter="login"
        >
        <div class="input-error">{{ errors.first('password') }}</div>
      </div>
      <div class="flex items-center justify-between">
        <router-link class="btn btn-link pl-0" :to="{ name: 'forgotPassword'}">Forgot Password?</router-link>
        <action-button class="btn btn-slate" id="btn-login" @click="login" :spin="attemptingLogin">Login</action-button>
      </div>
    </div>
    <div class="bg-grey-darker mt-4 rounded w-full md:w-128 px-8 py-6 text-center">
      <router-link class="text-grey-light font-bold no-underline" :to="{ name: 'register'}">Would you like to create a new account?</router-link>
    </div>
  </main>
</template>

<script lang="ts">
import store from '@/store/index';
import http from '@/repositories/session';
import { AuthToken, User } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import { State, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';
const namespace: string = 'auth';

@Component({
  components: { ActionButton },
  $_veeValidate: { validator: "new" }
})
  export default class LoginView extends mixins(BaseView) {
  @Mutation('session/storeAuthTokenInLocalStorage') storeAuthTokenInLocalStorage! : (authToken: AuthToken) => void
  @Mutation('session/setAuthTokenForSession') setAuthTokenForSession! : (authToken: AuthToken) => void

  email: string = '';
  password: string = '';
  attemptingLogin: boolean = false;

  /**
   * Element refs
   */
  $refs: any = {
    emailInput: HTMLFormElement
  }

  /**
   * Submit the login request for qualified credentials
   */
  login() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitCredentials()
        }
      })
  }

  /**
   * Ask the server to create a new auth token
   */
  private submitCredentials() {
    this.attemptingLogin = true;
    http.login({email: this.email, password: this.password})
      .then((response) => {
        const authToken: AuthToken = response && response.data;
        this.storeAuthTokenInLocalStorage(authToken);
        this.setAuthTokenForSession(authToken);
        this.$router.push({name: 'dashboard'});
      })
      .catch((error) => {
        this.attemptingLogin = false;
        this.handleResponseErrors(error);
      });
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.$nextTick(() => {
      this.$refs.emailInput.focus();
    });
  }

}
</script>
