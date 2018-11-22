<template>
  <button
    :class="{'disabled': spin}"
    @click="handleClick"
    :style="[spin ? {width: `${clientWidth}px`} : {}]"
    :id="id"
  >
    <span v-if="spin">
      <fa-icon icon="spinner" spin></fa-icon>
    </span>
    <span v-else>
      <slot></slot>
    </span>
    <portal to="modal" v-if="modalVisible">
      <div class="absolute fixed pin w-full h-full flex">
        <div class="center-xy bg-smoke">
            <div class="modal">
              <div class="text-black font-bold text-xl mb-8">{{ message }}</div>
              <div class="flex justify-end">
                <button
                  class="btn btn-red mr-4"
                  @click="cancel"
                  id="modal-btn-cancel"
                >{{ cancelLabel }}</button>
                <button
                  class="btn btn-green"
                  @click="agree"
                  id="modal-btn-confirm"
                >{{ confirmLabel }}</button>
              </div>
            </div>
        </div>
      </div>
    </portal>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class ActionButton extends Vue {
  @Prop({ default: false }) spin!: boolean;
  @Prop({ default: ''}) id!: string;
  @Prop({ default: false }) confirm!: boolean;
  @Prop({ default: 'Are you sure you want to do that?' }) message!: string;
  @Prop({ default: 'Confirm'}) confirmLabel!: string;
  @Prop({ default: 'Cancel' }) cancelLabel!: string;
  clientWidth: number = 0;
  modalVisible = false;

  /**
   * Process a click event
   */
  handleClick() {
    this.clientWidth = this.$el.clientWidth;

    if (this.confirm) {
      this.modalVisible = true;
    } else {
      this.$emit('click');
    }
  }

  /**
   * The user wants to proceed
   */
  agree() {
    this.modalVisible = false;
    this.$emit('click');
  }

  /**
   * The user wants to cancel
   */
  cancel() {
    this.modalVisible = false;
  }

  /**
   * The 'mounted' event lifecycle hook
   */
  mounted() {
    // Escape key event listener
    const escapeHandler = (e: any) => {
      if (this.modalVisible && e.key === 'Escape') {
        this.cancel();
      }
    };

    // Bind the event
    document.addEventListener('keydown', escapeHandler);

    // Register this event listener to be removed when the component is destroyed
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', escapeHandler);
    });

  }
}
</script>
