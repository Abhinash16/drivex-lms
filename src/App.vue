<template>
  <v-app id="app">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
<style>
* {
}
.v-btn,
.v-tab {
  text-decoration: none !important;
  text-transform: capitalize !important;
  letter-spacing: normal !important;
}
</style>
