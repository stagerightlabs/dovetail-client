<template>
  <main role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Organization Settings</h1>
      <h3>Labels</h3>
      <div class="input-group">
        <label>Notebooks:</label>
        <input
          type="text"
          id="input-label-notebooks"
          v-model="labelNotebooks"
          name="label.notebook"
          required
          v-validate
        >
        <div class="input-error">{{ errors.first('label.notebook') }}</div>
      </div>
      <action-button
        class="btn btn-slate"
        id="btn-submit"
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
import settings from '@/repositories/settings';
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
  @Mutation('session/writeOrgSetting') writeOrgSetting! : (setting: OrgSetting) => void

  labels_updating: boolean = false;
  labelNotebooks: string = '';

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
    let promises = [];
    if (this.fields['label.notebook'].dirty) {
        promises.push(
          settings.writeSetting('label.notebooks', this.labelNotebooks)
            .then(() => {
              this.writeOrgSetting({
                key: 'label.notebooks',
                value: this.labelNotebooks
              })
            })
            .catch((error) => {
              this.handleResponseErrors(error);
            })
        )
    }
    Promise.all(promises)
      .then(() => {
        this.labels_updating = false;
      })
  }

  mounted() {
    this.labelNotebooks = this.organization
      // @ts-ignore
      ? this.organization.settings.filter((setting) => setting.key === 'label.notebooks')[0].value
      : '';
  }

}
</script>

<style>

</style>
