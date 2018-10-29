<template>
  <div class="absolute pin mx-auto h-full flex flex-col justify-center items-center">
    <div class="card">
      <div class="mb-4">
        <label>Email:</label>
        <input type="text" v-model="email">
      </div>
      <div class="mb-4">
        <label>Password:</label>
        <input type="password" v-model="password" @keyup.enter="attemptLogin">
      </div>
      <div class="flex items-center justify-between">
        <a class="btn btn-link pl-0" href="#">Forgot Password?</a>
        <button class="btn btn-teal" @click="attemptLogin">Login</button>
      </div>
    </div>
    <div class="mt-4">
      <router-link class="text-grey-dark font-bold no-underline" :to="{ name: 'register'}">Create a New Account</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Action, Getter } from 'vuex-class';
import Component from 'vue-class-component';
import { AuthState, User } from '@/store/auth/types';
const namespace: string = 'auth';

@Component({})
export default class LoginView extends Vue {
  @State('profile') profile!: AuthState;
  @Action('login', { namespace }) login!: any;
  @Getter('fullName', { namespace }) fullName!: string;

  email : string = '';
  password : string = '';

  attemptLogin() {
    this.login({email: this.email, password: this.password});
  }

}
</script>

<style>

</style>
