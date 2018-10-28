<template>
  <div class="absolute pin mx-auto h-full flex justify-center items-center">
    <div class="card">
      <div class="input-group">
        <label>Organization:</label>
        <input type="text" v-model="organization">
      </div>
      <div class="input-group">
        <label>Your Name:</label>
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
        <input type="password" v-model="password_confirmation">
      </div>
      <div class="flex items-center justify-end text-right">
        <button class="btn btn-teal" @click="register">Register</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from '@/axios';
import Component from 'vue-class-component';
import { AuthState, AuthToken, User } from '@/store/auth/types';
import { Mutation } from 'vuex-class';
const namespace: string = 'auth';

@Component({})
export default class RegisterView extends Vue {

  @Mutation('setAuthCredentials', {namespace: 'auth'}) setAuthCredentials : any

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

      this.setAuthCredentials(authToken);
    }).catch((error) => {
      console.log('error', error);
    })
  }

}
</script>

<style>

</style>
