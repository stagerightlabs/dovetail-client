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
        >
        <div class="input-error">{{ errors.first('email') }}</div>
      </div>
      <div class="input-group">
        <label>Password:</label>
        <input
          type="password"
          v-model="password"
          name="password"
          v-validate="{required: true}"
          @keyup.enter="login"
        >
        <div class="input-error">{{ errors.first('password') }}</div>
      </div>
      <div class="flex items-center justify-between">
        <router-link class="btn btn-link pl-0" :to="{ name: 'forgotPassword'}">Forgot Password?</router-link>
        <button class="btn btn-slate" @click="login">Login</button>
      </div>
    </div>
    <div class="mt-4">
      <router-link class="text-grey-dark font-bold no-underline" :to="{ name: 'register'}">Would you like to create a new account?</router-link>
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
const namespace: string = 'auth';

@Component({
  $_veeValidate: { validator: "new" }
})
  export default class LoginView extends mixins(BaseView) {
  @Mutation('session/storeAuthTokenInLocalStorage') storeAuthTokenInLocalStorage! : (authToken: AuthToken) => void
  @Mutation('session/setAuthTokenForSession') setAuthTokenForSession! : (authToken: AuthToken) => void

  email : string = '';
  password : string = '';

  async login() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitCredentials()
        }
      })
  }

  private submitCredentials() {
    // Request an auth token from the api
    http.login({email: this.email, password: this.password})
      .then((response) => {
        const authToken: AuthToken = response && response.data;
        this.storeAuthTokenInLocalStorage(authToken);
        this.setAuthTokenForSession(authToken);
        this.$router.push({name: 'about'});
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

}
</script>
