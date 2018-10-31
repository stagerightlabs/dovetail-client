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
import Vue from 'vue';
import axios from '@/axios';
import store from '@/store/index';
import { State } from 'vuex-class';
import { AuthToken } from '@/store/auth/types';
import { AuthState, User } from '@/store/auth/types';
import BaseComponent from '@/mixins/BaseComponent.ts';
import Component, { mixins } from 'vue-class-component';
const namespace: string = 'auth';

@Component({
  $_veeValidate: { validator: "new" }
})
  export default class LoginView extends mixins(BaseComponent) {
  @State('profile') profile!: AuthState;

  email : string = '';
  password : string = '';

  // attemptLogin() {
  //   this.login({email: this.email, password: this.password});
  // }

  login() {
    // Request an auth token from the api
    axios.post('/login', {email: this.email, password: this.password})
      .then((response) => {
        const authToken: AuthToken = response && response.data;
        store.commit('auth/storeAuthTokenInLocalStorage', authToken);
        store.commit('auth/setAuthTokenForSession', authToken);
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

}
</script>

<style>

</style>
