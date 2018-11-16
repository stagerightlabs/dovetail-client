<template>
  <main role="main" class="billboard-wrapper">
    <div class="billboard">
      <h1 class="mb-4 text-center">Forgot your password?</h1>
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
      <div class="flex items-center justify-end">
        <button class="btn btn-blue" @click="requestReset">
          <span v-if="requestSubmitted" class="mx-7">
            <fa-icon icon="spinner" spin></fa-icon>
          </span>
          <span v-else>Request Reset</span></button>
      </div>
    </div>
    <div class="mt-4">
      <router-link class="text-grey-dark font-bold no-underline" :to="{ name: 'login'}">Nevermind, let's go back</router-link>
    </div>
  </main>
</template>

<script lang="ts">
import http from '@/repositories/session';
import BaseView from '@/mixins/BaseView.ts';
import { State, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';

@Component({
  $_veeValidate: { validator: "new" }
})
  export default class LoginView extends mixins(BaseView) {

  email : string = '';
  requestSubmitted = false;

  async requestReset() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitResetRequest()
        }
      })
  }

  private submitResetRequest() {
    this.requestSubmitted = true;
    http.requestPasswordReset({email: this.email})
      .then((response) => {
        this.toast({
          message: response.data.message,
          level: 'success'
        });
        this.$router.push({name: 'login'});
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.requestSubmitted = false;
      });
  }

}
</script>
