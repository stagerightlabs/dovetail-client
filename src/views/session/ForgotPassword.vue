<template>
  <main role="main" class="billboard-wrapper">
    <div class="billboard">
      <h1 class="mb-6 text-center">Forgot your password?</h1>
      <div class="input-group">
        <label>Email:</label>
        <input
          type="email"
          v-model="email"
          name="email"
          required
          v-validate
          @keyup.enter="requestReset"
        >
        <div class="input-error">{{ errors.first('email') }}</div>
      </div>
      <div class="flex items-center justify-end">
        <action-button class="btn btn-blue" @click="requestReset" :spin="requestSubmitted">Request Reset</action-button>
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
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
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
