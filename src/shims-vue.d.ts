declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

// Ignore type checks for the portal-vue library
declare module 'portal-vue';
