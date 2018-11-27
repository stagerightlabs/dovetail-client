<template>
  <div v-if="loading" class="center-xy">
    <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon>
  </div>
  <main v-else role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Profile</h1>
    </div>
  </main>
</template>

<script lang="ts">
import { User } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import profile from '@/repositories/profile';
import { Action, Getter, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class ProfileView extends mixins(BaseView) {
  @Getter('user', {namespace: 'session'}) user! : User;

  /**
   * Data
   */
  loading: boolean = false;

  /**
   * Ask the api to send a new email verification link
   */
  resendVerificationEmail() {
    profile.resendEmailVerificationLink()
      .then((response) => {
        this.toast({message: response.data.message, level: 'success'})
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Ensure we have a user profile available before showing the page
   */
  beforeMount() {
    if (this.user !== undefined) {
      this.loading = false;
    }
  }
}
</script>

<style>

</style>
