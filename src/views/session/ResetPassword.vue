<template>
  <main role="main" class="center-xy">
    <div class="billboard">
      <h1 class="mb-4 text-center">Reset Your Password</h1>
      <div class="input-group">
        <label>Email:</label>
        <input
          type="email"
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
          @keyup.enter="changePassword"
          name="password_confirmation"
          required
          v-validate
        >
        <div class="input-error">{{ errors.first('password_confirmation') }}</div>
      </div>
      <div class="flex items-center justify-end">
        <button class="btn btn-blue" @click="changePassword">
          <span v-if="requestSubmitted" class="mx-7">
            <!-- <fa-icon icon="spinner" spin></fa-icon> -->
          </span>
          <span v-else>Change Password</span></button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import http from '@/repositories/session';
import { AuthToken, User } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import { State, Mutation } from 'vuex-class';
import { Vue, Prop } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';

@Component({
  $_veeValidate: { validator: "new" }
})
export default class ResetPassword extends mixins(BaseView) {
  @Mutation('session/storeAuthTokenInLocalStorage') storeAuthTokenInLocalStorage! : (authToken: AuthToken) => void
  @Mutation('session/setAuthTokenForSession') setAuthTokenForSession! : (authToken: AuthToken) => void
  @Prop({}) token!: string;

  email : string = '';
  password: string = '';
  password_confirmation: string = '';
  requestSubmitted: boolean = false;

  async changePassword() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitPasswordChange()
        }
      })
  }

  private submitPasswordChange() {
    this.requestSubmitted = true;
    http.changePassword({
      email: this.email,
      token: this.token,
      password: this.password,
      password_confirmation: this.password_confirmation,
    })
      .then((response) => {
        const authToken: AuthToken = response && response.data;
        this.storeAuthTokenInLocalStorage(authToken);
        this.setAuthTokenForSession(authToken);
        this.toast({
          message: "Your password has been updated.",
          level: 'success'
        });
        this.$router.push({name: 'about'});
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.requestSubmitted = false;
      });
  }

}
</script>
