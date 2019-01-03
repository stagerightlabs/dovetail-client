<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    class="fill-current"
    :class="{spin: spin}"
    :width="width"
    :height="height"
  >
    <title v-if="title">{{ title }}</title>
    <component :is="icon" />
  </svg>
</template>

<script lang="ts">
import Cog from '@/icons/Cog.vue';
import Menu from '@/icons/Menu.vue';
import Close from '@/icons/Close.vue';
import Trash from '@/icons/Trash.vue';
import Reload from '@/icons/Reload.vue';
import Shield from '@/icons/Shield.vue';
import Refresh from '@/icons/Refresh.vue';
import Checkmark from '@/icons/Checkmark.vue';
import AddOutline from '@/icons/AddOutline.vue';
import EditPencil from '@/icons/EditPencil.vue';
import LockClosed from '@/icons/LockClosed.vue';
import Attachment from '@/icons/Attachment.vue';
import Conversation from '@/icons/Conversation.vue';
import ArrowThickLeft from '@/icons/ArrowThickLeft.vue';
import UserSolidCircle from '@/icons/UserSolidCircle.vue';
import { Vue, Component, Prop } from 'vue-property-decorator'
import ExclamationOutline from '@/icons/ExclamationOutline.vue';

@Component({components: {
  AddOutline,
  ArrowThickLeft,
  Attachment,
  Close,
  Cog,
  Checkmark,
  Conversation,
  EditPencil,
  ExclamationOutline,
  LockClosed,
  Menu,
  Reload,
  Refresh,
  Shield,
  Trash,
  UserSolidCircle,
}})
export default class Icon extends Vue {

  @Prop({required:true}) name!: string;
  @Prop({default: 16}) width!: number;
  @Prop({default: 16}) height!: number;
  @Prop({default: false, type: Boolean}) spin!: boolean;
  @Prop({default: ''}) title!: string;

  get icon() {
    return this.names[this.name];
  }

  names: any = {
    'add-outline': 'AddOutline',
    'arrow-thick-left': 'ArrowThickLeft',
    'attachment': 'Attachment',
    'close': 'Close',
    'cog': 'Cog',
    'checkmark': 'Checkmark',
    'conversation': 'Conversation',
    'edit-pencil': 'EditPencil',
    'exclamation-outline': 'ExclamationOutline',
    'lock-closed': 'LockClosed',
    'menu': 'Menu',
    'reload': 'Reload',
    'refresh': 'Refresh',
    'shield': 'Shield',
    'trash': 'Trash',
    'user-solid-circle': 'UserSolidCircle',
  };

};
</script>

<style scoped>
.svg-icon {
  font-size: 16px;
  color: #6F7E85;
  line-height: 30px;
  display: inline-block;
}

.spin {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
