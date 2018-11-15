<template>
  <div class="pin mx-auto h-full flex flex-col justify-center items-center">
    <div class="card">
      <div class="input-group">
        <label>Organization:</label>
        <input
          type="text"
          id="text-organization"
          v-model="organization"
          name="organization"
          required
          v-validate
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
        <button class="btn btn-teal" @click="register">Register</button>
      </div>
    </div>
    <div class="mt-4">
      <router-link class="text-grey-dark font-bold no-underline" :to="{ name: 'login'}">Already Have an Account?</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import repository from '@/repository';
import { Mutation } from 'vuex-class';
import { AuthState } from '@/store/types';
import { AuthToken, User } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import Component, { mixins } from 'vue-class-component';
const namespace: string = 'auth';

@Component({
  $_veeValidate: { validator: "new" }
})
export default class RegisterView extends mixins(BaseView) {

  @Mutation('auth/storeAuthTokenInLocalStorage') storeAuthTokenInLocalStorage! : (authToken: AuthToken) => void
  @Mutation('auth/setAuthTokenForSession') setAuthTokenForSession! : (authToken: AuthToken) => void

  name : string = '';
  organization : string = '';
  email : string = '';
  password : string = '';
  password_confirmation : string = '';

  async register() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitRegistration()
        }
      })
  }

  private submitRegistration() {
    repository.httpPostRegister({
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
    }).catch((error) => {
      this.handleResponseErrors(error);
    })
  }

}
</script>
