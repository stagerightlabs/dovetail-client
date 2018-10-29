<template>
  <div class="absolute pin mx-auto h-full flex flex-col justify-center items-center">
    <div class="card">
      <div class="input-group">
        <label>Organization:</label>
        <input type="text" v-model="organization">
      </div>
      <div class="input-group">
        <label>Your Full Name:</label>
        <input type="text" v-model="name">
      </div>
      <div class="input-group">
        <label>Email:</label>
        <input type="text" v-model="email">
      </div>
      <div class="input-group">
        <label>Password:</label>
        <input type="password" v-model="password">
      </div>
      <div class="input-group">
        <label>Confirm Password:</label>
        <input type="password" v-model="password_confirmation" @keyup.enter="register">
      </div>
      <div class="flex items-center justify-end text-right">
        <button class="btn btn-teal" @click="register">Register</button>
      </div>
    </div>
    <div class="mt-4">
      <router-link class="text-grey-dark font-bold no-underline" :to="{ name: 'login'}">Already Have an Account?</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from '@/axios';
import { Mutation } from 'vuex-class';
import Component from 'vue-class-component';
import { AuthState, AuthToken, User } from '@/store/auth/types';
const namespace: string = 'auth';

@Component({})
export default class RegisterView extends Vue {

  @Mutation('storeAuthTokenInLocalStorage', {namespace: 'auth'}) storeAuthTokenInLocalStorage : any
  @Mutation('setAuthTokenForSession', {namespace: 'auth'}) setAuthTokenForSession : any

  name : string = '';
  organization : string = '';
  email : string = '';
  password : string = '';
  password_confirmation : string = '';

  register() {
    axios.post('/register', {
      name: this.name,
      organization: this.organization,
      email: this.email,
      password: this.password,
      password_confirmation: this.password
    })
    .then((response) => {
      const authToken: AuthToken = response && response.data;
      const now = new Date();
      authToken.expiration_date = new Date(now.getTime() + (authToken.expires_in * 1000));
      localStorage.setItem('access_token', authToken.access_token);
      localStorage.setItem('access_expiration', authToken.expiration_date.toDateString());

      this.storeAuthTokenInLocalStorage(authToken);
      this.setAuthTokenForSession(authToken);
    }).catch((error) => {
      console.log('error', error);
    })
  }

}
</script>

<style>

</style>
