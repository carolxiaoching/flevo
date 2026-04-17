<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router';
  import NavbarComponent from '@/components/front/NavbarComponent.vue';
  import FooterComponent from '@/components/front/FooterComponent.vue';

  const route = useRoute();
</script>

<template>
  <NavbarComponent />
  <main
    class="main"
    :class="{
      'container-lg': route.name !== 'home',
      'd-flex justify-content-center align-items-center':
        route.name == 'forgetPassword' || route.name == 'resetPassword',
    }"
  >
    <RouterView />
  </main>
  <FooterComponent />
</template>

<style lang="scss">
  @import '@/assets/scss/all.scss';
</style>
