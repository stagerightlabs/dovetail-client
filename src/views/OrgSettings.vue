<template>
  <main role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Organization Settings</h1>
      <h3>Labels</h3>
      <div class="input-group">
        <label>Notebooks:</label>
        <input
          type="text"
          id="text-label-notebooks"
          v-model="labelNotebooks"
          name="label.notebook"
          required
          v-validate
        >
        <div class="input-error">{{ errors.first('label.notebook') }}</div>
      </div>
      <action-button
        class="btn btn-slate"
        @click="updateLabels"
        :spin="labels_updating"
      >
        Update Labels
      </action-button>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseView from '@/mixins/BaseView.ts';
import { Organization, OrgSetting } from '@/types';
import { Action, Getter, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class OrgSettings extends mixins(BaseView) {
  @Getter('organization', {namespace: 'session'}) organization! : Organization;

  labels_updating = false;
  labelNotebooks = this.organization
    // @ts-ignore
    ? this.organization.settings.filter((setting) => setting.key === 'label.notebooks')[0].value
    : '';

  async updateLabels() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
        this.requestLabelUpdate()
        this.labels_updating = true;
        }
      })
  }

  private requestLabelUpdate() {

  }

}
</script>

<style>

</style>
