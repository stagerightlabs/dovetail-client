e<template>
  <main role="main" class="center-xy">
    <div class="billboard">
      <h1 class="mb-6 text-center">Register</h1>
      <p>Dovetail is currently in closed beta; we are not accepting new registrations at this time.</p>
    </div>
    <div class="bg-grey-darker mt-4 rounded w-full md:w-128 px-8 py-6 text-center">
      <router-link class="text-grey-light font-bold no-underline" :to="{ name: 'login'}">Do you already have an account?</router-link>
    </div>
  </main>
</template>

<script lang="ts">
import BaseView from '@/mixins/BaseView.ts';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';
const namespace: string = 'auth';

@Component({})
export default class RegisterView extends mixins(BaseView) {



}
</script>
