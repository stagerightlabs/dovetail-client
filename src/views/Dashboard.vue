<template>
  <main role="main" class="page">
    <header>
      <h1>Dashboard</h1>
    </header>

    <article>
      <section class="content">
        <p>
          Welcome to Dovetail.  Get started by creating a new
          <router-link :to="{ name: 'notebooks'}">{{ singularNotebooksLabel }}</router-link>
          or exploring the other options in the menu.
        </p>
      </section>
    </article>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { Getter } from 'vuex-class';
import Component from 'vue-class-component';

  @Component({})
  export default class DashboardView extends Vue {

  @Getter('orgNotebooksLabel', {namespace: 'session'}) orgNotebooksLabel! : string;

  /**
   * Convert the org notebook label string to singular
   */
  get singularNotebooksLabel() {
    if (this.orgNotebooksLabel.endsWith('s')) {
      return this.orgNotebooksLabel.slice(0, -1).toLowerCase();
    }
    return this.orgNotebooksLabel.toLowerCase();
  }
}
</script>
