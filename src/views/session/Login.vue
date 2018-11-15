<template>
  <div class="pin mx-auto h-full flex flex-col justify-center items-center">
    <div class="card">
      <div class="mb-4">
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
      <div class="mb-4">
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
        <a class="btn btn-link pl-0" href="#">Forgot Password?</a>
        <button class="btn btn-teal" @click="login">Login</button>
      </div>
    </div>
    <div class="mt-4">
      <router-link class="text-grey-dark font-bold no-underline" :to="{ name: 'register'}">Create a New Account</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store/index';
import repository from '@/repository';
import { AuthToken, User } from '@/types';
import { AuthState } from '@/store/types';
import BaseView from '@/mixins/BaseView.ts';
import { State, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
const namespace: string = 'auth';

@Component({
  $_veeValidate: { validator: "new" }
})
  export default class LoginView extends mixins(BaseView) {
  @State('profile') profile!: AuthState;
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
    repository.httpPostLogin({email: this.email, password: this.password})
      .then((response) => {
        const authToken: AuthToken = response && response.data;
        this.storeAuthTokenInLocalStorage(authToken);
        this.setAuthTokenForSession(authToken);
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

}
</script>