<template>
  <div role="alert" aria-live="assertive" class="alert" :class="level" v-show="show">
    <div class="dismiss" @click="dismiss">
      <!-- <fa-icon icon="times" class="float-right cursor-pointer mx-2"></fa-icon> -->
    </div>
    {{ body }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class FlashMessage extends Vue {
  @Prop() message!: string;
  @Prop() level!: string;
  @Prop() nonce!: string;
  @Prop() delay!: number;

  body: string = '';
  type: string = 'info';
  show: boolean = true;

  dismiss() {
    this.show = false;
    this.$emit('remove', this.nonce);
  }

  created() {
    this.body = this.message;

    if (this.delay > 0) {
      setTimeout(() => {
        this.dismiss();
      }, this.delay);
    }
  }
};
</script>
