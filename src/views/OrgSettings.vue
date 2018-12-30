<template>
  <main role="main" class="page">
    <header>
      <h1>Organization Settings</h1>
    </header>
    <article>
      <header>
        <h3>Labels</h3>
      </header>
      <section class="content">
        <form class="max-w-sm m-auto">
          <div class="input-group flex items-center mt-8">
            <label>Notebooks:</label>
            <div class="ml-4 w-full">
              <input
                type="text"
                id="input-label-notebooks"
                v-model="labelNotebooks"
                name="label.notebook"
                required
                data-vv-as="Notebook Label"
                v-validate
                @keydown.enter="updateLabels"
              >
              <div class="input-error">{{ errors.first('label.notebook') }}</div>
            </div>
          </div>
          <div class="text-right mt-8">
            <action-button
              class="btn btn-blue"
              id="btn-submit"
              @click="updateLabels"
              :spin="updatingLabels"
              :disabled="!labelsAreDirty"
              prevent
            >
              Update Labels
            </action-button>
          </div>
        </form>
      </section>
    </article>
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

  updatingLabels: boolean = false;
  labelNotebooks: string = '';

  updateLabels() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.requestLabelUpdate()
          this.updatingLabels = true;
        }
      })

    this.$validator.fields
  }

  private requestLabelUpdate() {
    let promises = [];

    // @ts-ignore
    if (this.fields['label.notebook'].dirty) {
        promises.push(
          settings.writeSetting('label.notebooks', this.labelNotebooks)
            .then(() => {
              this.toast({
                message: "Then 'Notebooks' label has been updated",
                level: 'success'
              });
              this.writeOrgSetting({
                key: 'label.notebooks',
                value: this.labelNotebooks
              })
              this.$validator.flag('label.notebook', {
                dirty: false
              });
            })
            .catch((error) => {
              this.handleResponseErrors(error);
            })
        )
    }
    Promise.all(promises)
      .then(() => {
        this.updatingLabels = false;
      })
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.labelNotebooks = this.organization
      // @ts-ignore
      ? this.organization.settings.filter((setting) => setting.key === 'label.notebooks')[0].value
      : '';
  }

  /**
   * Has a new value been entered?
   */
  get labelsAreDirty() {
    return Object.keys(this.fields).some(key => this.fields[key].dirty);
  }

}
</script>

<style>

</style>
