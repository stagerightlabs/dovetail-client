<template>

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
export default class AcceptInvitation extends mixins(BaseView) {
  @Mutation('session/storeAuthTokenInLocalStorage') storeAuthTokenInLocalStorage! : (authToken: AuthToken) => void
  @Mutation('session/setAuthTokenForSession') setAuthTokenForSession! : (authToken: AuthToken) => void
  @Prop({}) code!: string;

  email : string = '';
  password: string = '';
  password_confirmation: string = '';
  requestSubmitted: boolean = false;
  loading: boolean = true;
  invalidInvitation: boolean = false;

  async changePassword() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitInvitationAcceptance()
        }
      })
  }

  private submitInvitationAcceptance() {
    this.requestSubmitted = true;
    http.acceptInvitation(this.code, {
      email: this.email,
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

  /**
   * The mounted life cycle hook
   */
  mounted() {
    this.confirmInvitation();
  }

  /**
   * Ask the server to validate an invitation before we proceed
   */
  private confirmInvitation() {
    http.confirmInvitation(this.code)
      .then(() => {
        this.loading = false;
      })
      .catch((error) => {
        this.invalidInvitation = true;
        this.loading = false;
      })
  }

}
</script>
