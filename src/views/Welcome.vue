<template>
  <main role="main" class="center-xy">
    <div class="billboard text-center">
      <img src="@/assets/dovetail_logo_blue.png" class="w-32 mt-6">
      <h1 class="mt-4 mb-6">dovetail</h1>
    </div>
    <div class="bg-grey-darker mt-4 rounded w-full md:w-128 px-8 py-6 text-center">
      <p class="text-white">
        <router-link class="text-grey-light font-bold no-underline" :to="{ name: 'register'}">Register</router-link>
        or
        <router-link class="text-grey-light font-bold no-underline" :to="{ name: 'login'}">Sign In</router-link>
      </p>
    </div>
  </main>
</template>
