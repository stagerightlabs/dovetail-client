<template>
  <main role="main">
    <div v-if="loading" class="center-xy">
      <icon name="refresh" width="128" height="128" class="text-grey-light" spin></icon>
    </div>
  </main>
</template>

<script lang="ts">
import { User } from '@/types';
import session from '@/repositories/session';
import BaseView from '@/mixins/BaseView.ts';
import profile from '@/repositories/profile';
import { State, Mutation } from 'vuex-class';
import { Vue, Prop } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';

@Component({})
export default class VerifyEmail extends mixins(BaseView) {
  @Mutation('saveSessionUser', {namespace: 'session'}) saveSessionUser! : (user: User) => void;
  @Prop({ required: true }) code!: string;

  loading = true;

  verifyEmail() {
    profile.verifyEmail({code: this.code})
      .then((response) => {
        const message = response.data.message;
        session.getUser()
          .then((response) => {
            this.saveSessionUser(response.data.data);
            this.toast({message, level: 'success'});
            this.$router.push({name: 'profile'});
          })
          .catch((error) => {
            // We shouldn't ever encounter this,
            // but this is a failsafe, just in case
            this.handleResponseErrors(error);
            this.toast({
              message: "There was a problem syncing with the server.",
              level: 'danger'
            });
            this.$router.push({name: 'profile'});
          });
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.$router.push({name: 'profile'});
      });
  }

  mounted() {
    this.verifyEmail();
  }

}
</script>
